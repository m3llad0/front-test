'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button, ColorSelect, GrilledTable, H1, IconButton, Input, Modal, Select } from "@components";
import { EditIcon, NoIcon } from '@icons';
import { fetchDivisasData, addDivisa, Divisa, editDivisa, deleteDivisa } from '@service/divisa';
import { fetchSucursalesData, Sucursal } from '@service/sucursal';

type DivisasManagerProps = {
  className?: string;
};

const DivisasManager = ({ className }: DivisasManagerProps) => {
  const [divisasData, setDivisasData] = useState<Divisa[]>([]);
  const [sucursalesData, setSucursalesData] = useState<Sucursal[]>([]);
  const [activeModal, setActiveModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDivisa, setCurrentDivisa] = useState<Divisa | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch Divisas on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const divisas = await fetchDivisasData();
        const sucursales = await fetchSucursalesData();
        setDivisasData(divisas);
        setSucursalesData(sucursales);
      } catch (error) {
        console.error('Error fetching divisas: ', error);
      }
    };
    fetchData();
  }, []);

  const sucursalOptions = sucursalesData.map((sucursal, index) => ({
    value: index,
    id: sucursal.id,
    label: sucursal.nombre,
  }));

  const openModal = (divisa?: Divisa) => {
    setIsEditing(!!divisa);
    setCurrentDivisa(
      divisa || {
        sucursal_id: '',
        nombre: '',
        mnemonico: '',
        vip: 0,
        monto_aprobacion: 0,
        tc_compra: 0,
        li_compra: 0,
        ls_compra: 0,
        tc_venta: 0,
        li_venta: 0,
        ls_venta: 0,
        color: '',
      }
    );
    setActiveModal(true);
  };

  const closeModal = () => {
    setActiveModal(false);
    setCurrentDivisa(null);
    setError(null);
  };

  const handleInputChange = (key: keyof Divisa) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCurrentDivisa((prev) => ({
      ...prev!,
      [key]: value,
    }));
  };

  const handleSucursalChange = (index: number) => {
    const selectedSucursal = sucursalOptions[index];
    setCurrentDivisa((prev) => ({
      ...prev!,
      sucursal_id: selectedSucursal.id,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isEditing && currentDivisa) {
        await editDivisa(currentDivisa);
      } else {
        addDivisa(currentDivisa!);
      }

      const updatedDivisas = await fetchDivisasData();
      setDivisasData(updatedDivisas);
      closeModal();
    } catch (err) {
      setError('Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDivisa = async (divisaId: number) => {
    setLoading(true);
    setError(null);

    try {
      await deleteDivisa(divisaId);
      setDivisasData((prevData) => prevData.filter((divisa) => divisa.id !== divisaId));
      console.log(`Divisa with id ${divisaId} deleted successfully`);
    } catch (error) {
      setError('Error deleting divisa');
      console.error('Error deleting divisa: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <GrilledTable
        title={
          <div className='flex justify-between items-center mb-1'>
            <H1 className='text-xl'>Divisas</H1>
            <Button onClick={() => openModal()} className='space-x-[10]'><span>Agregar Divisa</span><span>+</span></Button>
          </div>
        }
        columns={[
          // { header: '', key: 'color', render: (row) => <ColorSelect disabled initialColor={row.divisaData.color} /> },
          { header: 'Sucursal', key: 'sucursal' },
          { header: 'Divisa', key: 'nombre',
            render: (row) => (
              <div className='flex items-center space-x-2'>
                <ColorSelect color={row.divisaData.color} disabled className='w-4 h-2'/>
                <span>{row.nombre}</span>
              </div>
            )
          },
          { header: 'Monto VIP', key: 'vip', divided: true },
          { header: 'Monto Autorización', key: 'monto_aprobacion' },
          { header: 'Tipo de cambio compra', key: 'tc_compra' },
          { header: 'Límite inferior compra', key: 'li_compra' },
          { header: 'Límite superior compra', key: 'ls_compra' },
          { header: 'Tipo de cambio venta', key: 'tc_venta' },
          { header: 'Límite inferior venta', key: 'li_venta' },
          { header: 'Límite superior venta', key: 'ls_venta' },
          {
            header: '',
            key: 'edit',
            render: (row) => <IconButton icon={<EditIcon />} onClick={() => openModal(row.divisaData)} />,
          },
          {
            header: '', key: 'delete',
            render: (row) => <IconButton icon={<NoIcon />} onClick={() => handleDeleteDivisa(row.divisaData.id)} />,
          },
        ]}
        rows={divisasData.map((divisa) => {
          const sucursal = sucursalesData.find(s => s.id === divisa.sucursal_id);
          return {
            sucursal: sucursal ? sucursal.nombre : '!',
            nombre: divisa.nombre,
            vip: divisa.vip,
            monto_aprobacion: divisa.monto_aprobacion,
            tc_compra: divisa.tc_compra,
            li_compra: divisa.li_compra,
            ls_compra: divisa.ls_compra,
            tc_venta: divisa.tc_venta,
            li_venta: divisa.li_venta,
            ls_venta: divisa.ls_venta,
            divisaData: divisa,
          }
        })}
        footer={
          divisasData.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No hay datos que mostrar</div>
          ) : null
        }
        className='mb-8'
      />

      {/* Modal for Add/Edit Divisa */}
      <Modal isVisible={activeModal} onClose={closeModal} className="px-8 py-6">
        <H1 className="text-left tracking-tight mb-10">
          {isEditing ? 'Editar Divisa' : 'Agregar Divisa'}
        </H1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-3 gap-x-16 gap-y-6 mb-10">
        <Select
            label="Sucursal"
            placeholder="Sucursal de la divisa"
            options={sucursalOptions.map((sucursal, index) => ({
              value: index,
              label: sucursal.label,
            }))}
            value={sucursalOptions.findIndex((s) => s.id === currentDivisa?.sucursal_id)} // Map current ID to the correct index
            onChange={handleSucursalChange}
            className="col-span-3"
          />
          {[{ label: 'Nombre de la divisa', key: 'nombre', placeholder: "Ej: Pesos *", value: currentDivisa?.nombre || '' },
            { label: 'Mnemónico', key: 'mnemonico', placeholder: "Ej: MXN *", value: currentDivisa?.mnemonico || '' },
            { label: 'Monto VIP', key: 'vip', placeholder: 'Monto VIP *', value: currentDivisa?.vip || '' },
            { label: 'Monto Autorización', key: 'monto_aprobacion', placeholder: 'Monto Autorización *', value: currentDivisa?.monto_aprobacion || '' },
            { label: 'Tipo de cambio compra', key: 'tc_compra', placeholder: 'Tipo de cambio compra *', value: currentDivisa?.tc_compra || '' },
            { label: 'Límite inferior compra', key: 'li_compra', placeholder: 'Límite inferior compra *', value: currentDivisa?.li_compra || '' },
            { label: 'Límite superior compra', key: 'ls_compra', placeholder: 'Límite superior compra *', value: currentDivisa?.ls_compra || '' },
            { label: 'Tipo de cambio venta', key: 'tc_venta', placeholder: 'Tipo de cambio venta *', value: currentDivisa?.tc_venta || '' },
            { label: 'Límite inferior venta', key: 'li_venta', placeholder: 'Límite inferior venta *', value: currentDivisa?.li_venta || '' },
            { label: 'Límite superior venta', key: 'ls_venta', placeholder: 'Límite superior venta *', value: currentDivisa?.ls_venta || '' },
          ].map((inputProps, index) => (
            <Input
              key={index}
              label={inputProps.label}
              placeholder={inputProps.placeholder}
              value={inputProps.value}
              onChange={handleInputChange(inputProps.key as keyof Divisa)}
            />
          ))}
          <Input
            type='color'
            label='Color asociado'
            placeholder='Ej: #2451E3'
            value={currentDivisa?.color}
            onChange={handleInputChange('color')}
          />
        </div>

        <div className="flex justify-end items-end w-full space-x-4">
          <Button onClick={closeModal} className='bg-qt_mid text-qt_dark'>Cancelar</Button>
          <Button onClick={handleSubmit} loading={loading}>
            {isEditing ? 'Guardar Cambios' : 'Registrar'}
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default DivisasManager;