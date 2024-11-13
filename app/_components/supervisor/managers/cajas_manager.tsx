'use client';

import { useState, useEffect } from 'react';
import { AccentTable, Button, ColorSelect, GrilledTable, H1, IconButton, Input, KeyValuePair, Modal, P, QuantityInput, Select } from "@components";
import { EditIcon, NoIcon } from '@icons';
import { fetchCajasData, addCaja, Caja, deleteCaja, Billete } from '@service/caja';
import { fetchSucursalesData, Sucursal } from '@service/sucursal';
import { fetchDivisasData, Divisa, deleteDivisa } from '@service/divisa';

type Currency = {
  Serie: string | number;
  Cantidad: number;
  Saldo: number;
  warning?: string; // In case of discrepancy.
};

type CajasManagerProps = {
  className?: string;
};

const CajasManager = ({ className }: CajasManagerProps) => {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [cajasData, setCajasData] = useState<Caja[]>([]);
  const [sucursalesData, setSucursalesData] = useState<Sucursal[]>([]);
  const [divisasData, setDivisasData] = useState<Divisa[]>([]);
  const [sucursal, setSucursal] = useState<string | null>(null);
  const [divisa, setDivisa] = useState<number | null>(null);
  const [saldoInicial, setSaldoInicial] = useState<number>();
  const [currencyData, setCurrencyData] = useState<Currency[]>([]);
  const [currentCaja, setCurrentCaja] = useState<Caja | null>(null);
  const [filteredDivisas, setFilteredDivisas] = useState<Divisa[]>(divisasData);
  const [loading, setLoading] = useState(false);

  const calculatedTotal = currencyData.reduce((total, row) => total + row.Saldo, 0);
  const difference = (saldoInicial ?? 0) - calculatedTotal;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cajas, sucursales, divisas] = await Promise.all([
          fetchCajasData(),
          fetchSucursalesData(),
          fetchDivisasData()
        ]);
        console.log('divisas', divisas);

        if (cajas) setCajasData(cajas);
        if (sucursales) setSucursalesData(sucursales);
        if (divisas) {
          setDivisasData(divisas);
          const assignedDivisaIds = new Set(cajas.map((caja) => caja.divisa_id));
          const availableDivisas = divisas.filter((divisa) => !assignedDivisaIds.has(divisa.id ?? -1));
          setFilteredDivisas(availableDivisas);
        }
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const openModal = (caja?: Caja) => {
    if (caja) {
      // If editing, set current Caja, sucursal, and divisa based on existing data
      setCurrentCaja(caja);
      setSucursal(caja.sucursal_id ?? null);
      setDivisa(caja.divisa_id);

      // Filter divisas based on the existing sucursal of the Caja
      const assignedDivisa = divisasData.find((divisa) => divisa.id === caja.divisa_id);
      const dropdownDivisas = assignedDivisa
        ? [assignedDivisa, ...filteredDivisas.filter((d) => d.id !== caja.divisa_id)]
        : filteredDivisas;

      setFilteredDivisas(dropdownDivisas);
    } else {
      // For adding a new caja, use only unassigned divisas
      setCurrentCaja(null);
      setSucursal(null);
      setDivisa(null);
      setFilteredDivisas(divisasData.filter((divisa) => filteredDivisas.includes(divisa)));
    }
    setActiveModal('cajaModal');
  };

  const closeModal = () => {
    setActiveModal(null);
    setCurrentCaja(null); // Reset currentCaja on modal close
    setSucursal(null);
    setDivisa(null);
  };

  const handleAddRow = () => {
    setCurrencyData((prevData) => [
      ...prevData,
      { Serie: '', Cantidad: 0, Saldo: 0 },
    ]);
  };

  const sucursalOptions = sucursalesData.map((sucursal, index) => ({
    value: index,
    id: sucursal.id,
    label: sucursal.nombre,
  }));

  const divisaOptions = filteredDivisas.map((divisa) => ({
    value: Number(divisa.id),
    id: Number(divisa.id),
    label: divisa.nombre,
    color: divisa.color,
  }));

  const handleRowChange = (index: number, key: keyof Currency, value: number | string) => {
    setCurrencyData((prevData) => {
      const newData = [...prevData];
      const row = { ...newData[index], [key]: value };

      // Recalculate saldo for the row based on Serie * Cantidad
      row.Saldo = (isNaN(Number(row.Serie)) ? 1 : Number(row.Serie)) * row.Cantidad;

      newData[index] = row;
      return newData;
    });
  };

  const handleRemoveRow = (index: number) => {
    setCurrencyData((prevData) => prevData.filter((_, i) => i !== index));
  };

  const handleSucursalChange = (index: number) => {
    const selectedSucursal = sucursalOptions[index].id;
    setSucursal(selectedSucursal);
    setDivisa(null); // Clear the divisa selection when sucursal changes
    const assignedDivisaIds = new Set(cajasData.map((caja) => caja.divisa_id));
    const availableDivisasForSucursal = selectedSucursal
      ? divisasData.filter(
        (divisa) => divisa.sucursal_id === selectedSucursal && !assignedDivisaIds.has(divisa.id ?? -1)
        )
      : [];
    setFilteredDivisas(availableDivisasForSucursal);
  };

  const handleDivisaChange = (index: number) => {
    const selectedDivisa = divisaOptions[index].id;
    setDivisa(selectedDivisa);

    // Find the corresponding sucursal for the selected divisa
    const correspondingDivisa = divisasData.find((divisa) => divisa.id === selectedDivisa);
    if (correspondingDivisa) {
      setSucursal(correspondingDivisa.sucursal_id);
    }
  };

  const handleCajaSubmit = async () => {
    setLoading(true)
    try {
      // Ensure divisa is set
      if (!sucursal || !divisa || (saldoInicial ?? 0) <= 0) {
        throw new Error("All required fields must be filled, and the saldo must be greater than zero.");
      }

      // Prepare billetes object from currencyData
      const billetes: Billete = {};
      currencyData.forEach((row) => {
        if (row.Serie && row.Cantidad) {
          billetes[row.Serie] = row.Cantidad;
        }
      });

      // Ensure billetes is not empty
      if (Object.keys(billetes).length === 0) {
        throw new Error("At least one billete must be defined.");
      }

      // Prepare caja data
      const newCaja: Caja = {
        sucursal_id: sucursal,
        divisa_id: divisa,
        billetes: billetes,
      };

      // If editing an existing Caja, update it, otherwise add a new one
      if (currentCaja) {
        // Logic to update an existing Caja
        console.log("Updating existing Caja");
      } else {
        await addCaja(newCaja); // Add a new Caja
        console.log("Caja added successfully!");
      }

      // Optionally refetch data or close the modal
      const updatedCajas = await fetchCajasData();
      setCajasData(updatedCajas);
      closeModal();
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error adding or updating caja: ", error.message);
      } else {
        console.error("Unknown error: ", error);
      }
    } finally {
      setLoading(false)
    }
  };

  const handleDeleteCaja = async (id: number) => {
    setLoading(true);
    try {
      await deleteCaja(id);
      setCajasData((prevData) => prevData.filter((caja) => caja.id !== id));
      console.log(`Caja with id ${id} deleted succesfully`);
    } catch (error) {
      console.error('Error deleting caja: ', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <GrilledTable
        title={
          <div className="flex justify-between items-center mb-1">
            <H1 className="text-xl">Cajas</H1>
            <Button onClick={() => openModal()} className="space-x-16">
              <span>Agregar Caja</span>
              <span>+</span>
            </Button>
          </div>
        }
        columns={[
          { header: 'Sucursal', key: 'sucursal' },
          {
            header: 'Divisa', key: 'divisa', render: (row) => {
              console.log('Divisa', row.divisa);
              return row.divisa ? (
                <div className='flex items-center space-x-2'>
                  <ColorSelect color={row.divisa.color} disabled className='w-4 h-2' />
                  <span>{row.divisa.nombre || '---'}</span>
                </div>
              ) : (
                <span>---</span>
              );
            }
          },
          { header: 'Serie', key: 'serie' },
          { header: 'Cantidad inicial', key: 'inicial' },
          { header: 'Cantidad final', key: 'final' },
          { header: 'Estatus', key: 'estatus' },
          { header: '', key: 'edit', render: (row) => <IconButton icon={<EditIcon />} onClick={() => openModal(row)} /> },
          { header: '', key: 'delete', render: (row) => (<IconButton icon={<NoIcon />} onClick={() => handleDeleteCaja(row.serie)}/>) },
        ]}
        rows={cajasData.map((caja) => {
          const sucursalName = sucursalesData.find((sucursal) => sucursal.id === caja.sucursal_id)?.nombre || '---';
          const divisa = divisasData.find((div) => div.id === caja.divisa_id) || null;
          return {
            sucursal: sucursalName,
            divisa: divisa,
            serie: caja.id,
          }
        })}
        footer={
          cajasData.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No hay datos que mostrar</div>
          ) : null
        }
        className="mb-8"
      />

      {/* Modal for Adding/Editing Caja */}
      <Modal isVisible={activeModal === 'cajaModal'} onClose={closeModal}>
        <H1 className="text-left tracking-tight mb-1">{currentCaja ? 'Editar Caja' : 'Agregar Caja'}</H1>
        <P className="text-sm mb-10">Ingresa las series y cantidades, se indicará si esto coincide con el saldo.</P>
        <div className="grid grid-cols-3 gap-x-8 gap-y-6 mb-8">
          <Select
            label="Sucursal"
            placeholder="Sucursal de la caja"
            options={sucursalOptions.map((sucursal, index) => ({
              value: index,
              label: sucursal.label,
            }))}
            value={sucursalOptions.findIndex((s) => s.id === sucursal)} // Map current ID to the correct index
            onChange={handleSucursalChange}
          />
          <Select
            label="Divisa"
            placeholder="Divisa *"
            options={divisaOptions.map((divisa, index) => ({
              value: index,
              label: divisa.label,
            }))}
            value={divisaOptions.findIndex((d) => d.id === divisa)}
            onChange={handleDivisaChange}
          />
          <Input
            label="Saldo de la divisa"
            placeholder="17,650.00"
            type="number"
            value={saldoInicial}
            onChange={(e) => setSaldoInicial(Number(e.target.value) || 0)}
          />
        </div>
        <AccentTable
          header={
            <>
              {divisa ? (
                <>
                  <ColorSelect disabled color={divisasData.find(d => d.id === divisa)?.color || '#000'} className='w-2 h-6' />
                  <H1 className="text-base text-qt_primary mb-4 pl-2">
                    {`Caja de ${divisasData.find(d => d.id === divisa)?.nombre || 'Divisa desconocida'}`}
                  </H1>
                </>
              ) : (
                <H1 className="text-base text-qt_primary mb-4 pl-2">Nueva Caja</H1>
              )}
            </>
          }
          columns={[
            {
              header: 'Serie',
              key: 'Serie',
              render: (row: Currency) => (
                <Input
                  className="m-0"
                  value={row.Serie}
                  placeholder="Cifra de la serie *"
                  onChange={(e) => handleRowChange(currencyData.indexOf(row), 'Serie', e.target.value)}
                />
              ),
            },
            {
              header: 'Cantidad',
              key: 'Cantidad',
              render: (row: Currency) => (
                <QuantityInput
                  initialValue={row.Cantidad}
                  max={999}
                  onChange={(newCantidad) => handleRowChange(currencyData.indexOf(row), 'Cantidad', newCantidad ?? 0)}
                />
              ),
            },
            { header: 'Saldo', key: 'Saldo', render: (row: Currency) => row.Saldo },
            {
              header: '',
              key: 'Remove',
              render: (row: Currency) => (
                <IconButton icon={<NoIcon />} onClick={() => handleRemoveRow(currencyData.indexOf(row))} />
              ),
            },
          ]}
          rows={currencyData}
          pin={<Button onClick={handleAddRow}>Agregar serie</Button>}
          footer={
            <div className="flex justify-between">
              <KeyValuePair keyName="Diferencia" value={difference.toLocaleString()} />
              <KeyValuePair keyName="Total" value={calculatedTotal.toLocaleString()} />
            </div>
          }
          className="mb-8 w-full"
        />

        {/* Warnings */}
        <div className="mb-6 space-y-2">
          {(!divisa || (saldoInicial ?? 0) <= 0) && (
            <div className="bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg p-2">
              Todos los campos deben estar completos y el saldo debe ser mayor a cero.
            </div>
          )}
          {currencyData.length === 0 && (
            <div className="bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg p-2">
              No se ha definido ninguna serie. Agregue al menos una serie.
            </div>
          )}
          {difference !== 0 && (
            <div className="bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg p-2">
              La diferencia entre el saldo ingresado y el saldo calculado no es cero.
            </div>
          )}
        </div>

        <div className="flex justify-end items-end w-full space-x-4">
          <Button onClick={closeModal} className="bg-qt_mid text-qt_dark">Cancelar</Button>
          <Button onClick={handleCajaSubmit} loading={loading}>{currentCaja ? 'Guardar Cambios' : 'Registrar'}</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CajasManager;
