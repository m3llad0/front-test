'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button, DateSelect, GrilledTable, H1, IconButton, Input, Modal, Select } from "@components";
import { EditIcon, NoIcon } from '@icons';
import { fetchOperadoresData, addOperador, editOperador, deleteOperador, Operador } from '@service/operador';
import { fetchSucursalesData, Sucursal } from '@service/sucursal';

const OperadoresManager = ({className = ''}) => {
  const [operadoresData, setOperadoresData] = useState<Operador[]>([]);
  const [sucursalesData, setSucursalesData] = useState<Sucursal[]>([]);
  const [activeModal, setActiveModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentOperador, setCurrentOperador] = useState<Operador | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch operadores and sucursales on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const operadores = await fetchOperadoresData();
        const sucursales = await fetchSucursalesData();
        setOperadoresData(operadores);
        setSucursalesData(sucursales);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const sucursalOptions = sucursalesData.map((sucursal, index) => ({
    value: index,
    id: sucursal.id,
    label: sucursal.nombre,
  }));

  const openModal = (operador?: Operador) => {
    setIsEditing(!!operador);
    setCurrentOperador(
      operador || {
        id: 0,
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        antiguedad: undefined,
        sucursal_id: '',
      }
    );
    setActiveModal(true);
  };

  const closeModal = () => {
    setActiveModal(false);
    setCurrentOperador(null);
    setError(null);
  };

  const handleInputChange = (key: keyof Operador) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCurrentOperador((prev) => ({
      ...prev!,
      [key]: value,
    }));
  };

  const handleSucursalChange = (index: number) => {
    const selectedSucursal = sucursalOptions[index];
    setCurrentOperador((prev) => ({
      ...prev!,
      sucursal_id: selectedSucursal.id,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      if (isEditing && currentOperador?.id) {
        await editOperador(currentOperador.id, currentOperador);
      } else {
        await addOperador(currentOperador!);
      }

      const updatedOperadores = await fetchOperadoresData();
      setOperadoresData(updatedOperadores);

      closeModal();
    } catch (err) {
      setError('Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteOperador = async (id: number) => {
    if (confirm("Are you sure you want to delete this operador?")) {
      setLoading(true);
      try {
        await deleteOperador(id);
        setOperadoresData((prevData) => prevData.filter((operador) => operador.id !== id));
        console.log(`Operador with ID ${id} deleted successfully`);
      } catch (error) {
        setError('Error deleting operador');
        console.error('Error deleting operador:', error);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <div className={`operadores-manager ${className}`}>
      {/* Table of Operadores */}
      <GrilledTable
        title={<div className='flex justify-between items-center mb-1'>
          <H1 className='text-xl'>Operadores</H1>
          <Button onClick={() => openModal()} className='space-x-8'><span>Agregar Operador</span><span>+</span></Button>
        </div>}
        columns={[
          { header: 'Sucursal', key: 'sucursal' },
          { header: 'Nombre', key: 'nombre' },
          { header: 'Apellido Paterno', key: 'apellidoPaterno' },
          { header: 'Apellido Materno', key: 'apellidoMaterno' },
          { header: 'Teléfono', key: 'telefono' },
          { header: '', key: 'edit', render: (row) => <IconButton
              icon={<EditIcon />}
              onClick={() => openModal(row.operadorData)}
            />
          },
          { header: '', key: 'delete',
            render: (row) => <IconButton icon={<NoIcon />} onClick={() => handleDeleteOperador(row.key)}
            />
          }
        ]}
        rows={operadoresData.map((operador) => {
          const sucursal = sucursalesData.find(s => s.id === operador.sucursal_id);
          return {
            key: operador.id,
            sucursal: sucursal ? sucursal.nombre : '!',
            nombre: operador.nombre,
            apellidoPaterno: operador.apellidoPaterno,
            apellidoMaterno: operador.apellidoMaterno,
            telefono: operador.telefono,
            operadorData: operador,
          };
        })}
        footer={
          operadoresData.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No hay datos que mostrar</div>
          ) : null
        }
      />

      {/* Modal for Add/Edit Operador */}
      <Modal isVisible={activeModal} onClose={closeModal} className="px-8 py-6">
        <H1 className="text-left tracking-tight mb-10">
          {isEditing ? 'Editar Operador' : 'Agregar Operador'}
        </H1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-2 gap-x-16 gap-y-6 mb-10">
          {[
            { label: 'Nombre(s)', key: 'nombre', placeholder: 'Nombre(s) *', value: currentOperador?.nombre || '' },
            { label: 'Apellido Paterno', key: 'apellidoPaterno', placeholder: 'Apellido Paterno *', value: currentOperador?.apellidoPaterno || '' },
            { label: 'Apellido Materno', key: 'apellidoMaterno', placeholder: 'Apellido Materno *', value: currentOperador?.apellidoMaterno || '' },
            { label: 'Teléfono', key: 'telefono', placeholder: 'Teléfono *', value: currentOperador?.telefono || '' },
          ].map((inputProps, index) => (
            <Input
              key={index}
              label={inputProps.label}
              placeholder={inputProps.placeholder}
              value={inputProps.value}
              onChange={handleInputChange(inputProps.key as keyof Operador)}
            />
          ))}

          <Select
            label="Sucursal"
            placeholder="Sucursal del operador"
            options={sucursalOptions.map((sucursal, index) => ({
              value: index,
              label: sucursal.label,
            }))}
            value={sucursalOptions.findIndex((s) => s.id === currentOperador?.sucursal_id)} // Map current ID to the correct index
            onChange={handleSucursalChange}
            className="col-span-2"
          />
          <DateSelect
            label='Antiguedad'
            value={currentOperador?.antiguedad ? new Date(currentOperador.antiguedad) : undefined}
            onChange={(date) => setCurrentOperador(prev => ({
              ...prev!,
              antiguedad: date,
            }))}
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

export default OperadoresManager;