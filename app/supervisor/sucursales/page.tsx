'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { AccentTable, Button, ColorSelect, GrilledTable, H1, IconButton, Input, KeyValuePair, Modal, P, QuantityInput, Select, SlideSwitch, Stepper } from "@components";
import { CancelIcon, EditIcon, NoIcon } from '@icons';
import { CurrentDateMXN } from '@utils';
import { fetchOperadoresData, addOperador, Operador, editOperador, wipeAllOperadores } from '@service/operador'
import { fetchCajasData, addCaja, Caja, Billete } from '@service/caja'
import { fetchSucursalesData, addSucursal, Sucursal, wipeAllSucursales, createFirebaseSucursalUser, } from '@service/sucursal'

type Currency = {
  Serie: string | number;
  Cantidad: number;
  Saldo: number;
  warning?: string; // In case of discrepancy.
};

// ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

export default function Sucursales() {

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const [loading, setLoading] = useState(false);

  // Sucursales
  const [sucursalesData, setSucursalesData] = useState<Sucursal[]>([])
  const [newSucursal, setNewSucursal] = useState<Sucursal>({
    id: '',
    nombre: '',
    presupuesto: 0,
    direccion: '',
    estado: '',
    telefono: '',
    email: '',
    password: '',
    saldoPesos: 0,
    saldoDolares: 0,
  });

  const [direccionData, setDireccionData] = useState({
    calle: '',
    numeroExterior: '',
    codigoPostal: '',
    municipio: '',
  });

  // Operadores
  const [operadoresData, setOperadoresData] = useState<Operador[]>([])
  const [newOperador, setNewOperador] = useState<Operador>({
    id: 0,
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    telefono: '',
    antiguedad: new Date().toISOString(),
    sucursal_id: -1,
    clave: Math.floor(100000 + Math.random() * 900000),
    createdClave: new Date().toISOString(),
    needToChangePassword: false,
  })

  // Cajas
  const [cajasData, setCajasData] = useState<Caja[]>([]);
  const [divisa, setDivisa] = useState<string>();
  const [saldoInicial, setSaldoInicial] = useState<number>();
  const [currencyData, setCurrencyData] = useState<Currency[]>([]);

  const calculatedTotal = currencyData.reduce((total, row) => total + row.Saldo, 0);
  const difference = (saldoInicial ?? 0) - calculatedTotal;

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const operadores = await fetchOperadoresData();
        const cajas = await fetchCajasData();

        const sucursales = await fetchSucursalesData();
        
        setSucursalesData(sucursales);
        setOperadoresData(operadores);
        setCajasData(cajas);

      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    fetchData();
  }, []);

  const sucursalOptions = sucursalesData.map((sucursal) => ({
    value: sucursal.id,
    label: sucursal.nombre,
  }))

  const openModal = (modalID: string, isEditing: boolean = false, operador?: Operador) => {
    setCurrentStep(0);
    setIsEditing(isEditing);

    if (isEditing && operador) {
      if (!operador.id) {
        console.error("Operador object is missing `id` when editing:", operador);
      }
      setNewOperador(operador);
    } else if (modalID === 'operadorModal') {
      // Reset newOperador to initial values only when adding a new operador
      setNewOperador({
        id: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        telefono: '',
        antiguedad: new Date().toISOString(),
        sucursal_id: '',
        clave: Math.floor(100000 + Math.random() * 900000),
        createdClave: new Date().toISOString(),
        needToChangePassword: false,
      });
    }

    if (modalID !== 'operadorModal') {
      // If we are not dealing with the operador modal, we want to preserve the current operador data
      setNewOperador((prev) => (operador ? operador : prev));
    }

    setActiveModal(modalID);
  };

  const closeModal = () => {
    setActiveModal(null)
    // DEBUG
    // wipeAllOperadores();
    // wipeAllSucursales();
  }

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      handleSubmit();
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    } else {
      closeModal();
    }
  }

  const handleOperadorInputChange = (key: keyof Operador) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target; // Get the input's value
    setNewOperador((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleAddressChange = (key: keyof typeof direccionData) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setDireccionData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted!")
  }

  const handleSucursalSubmit = async () => {
    try {

      const fullAddress = `${direccionData.calle} ${direccionData.numeroExterior}, ${direccionData.municipio} C.P. ${direccionData.codigoPostal}`;
      const newSucursalData = {
        nombre: newSucursal.nombre,
        presupuesto: newSucursal.nombre,
        direccion: fullAddress,
        estado: newSucursal.estado,
        telefono: newSucursal.telefono,
        email: newSucursal.email,
      };

      closeModal();
    } catch (error) {
      console.error('Error adding sucursal and creating Firebase user: ', error);
    }
  };

  const handleSucursalExpressSubmit = async () => {
    try {
      setLoading(true);
      
      // # 1 - Create firebase user
      const firebaseSucursalUser = await createFirebaseSucursalUser(newSucursal.email!, newSucursal.password!);

      const newSucursalData: Sucursal = {
        id: firebaseSucursalUser.uid,
        nombre: newSucursal.nombre,
        presupuesto: newSucursal.presupuesto,
        direccion: newSucursal.direccion,
        estado: newSucursal.estado,
        telefono: newSucursal.telefono,
      };

      console.log('Data being sent: ', newSucursalData);
      const createdSucursal = await addSucursal(newSucursalData);

      setSucursalesData((prevData) => [...prevData, createdSucursal]);

      closeModal();

      const updatedSucursales = await fetchSucursalesData();
      setSucursalesData(updatedSucursales);

    } catch (error) {
      console.error('Error adding sucursal to the database: ', error);
    }
  };

  const handleSucursalInputChange = (key: keyof Sucursal) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNewSucursal((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleOperadorData = async () => {
    try {
      if (isEditing && newOperador.id) {
        await editOperador(newOperador.id, newOperador);
      } else {
        await addOperador(newOperador);
      }

      const updatedOperadores = await fetchOperadoresData(); // Re-fetch operadores data
      setOperadoresData(updatedOperadores); // Update state with new data
      closeModal();
    } catch (error) {
      console.error(`Error ${isEditing ? 'editing' : 'adding'} operador: `, error);
    }
    // wipeAllOperadores(); //Debug ONLY
  };

  const handleEditOperadorEntry = (operador: Operador) => {
    if (operador && operador.id !== undefined) {
      console.log('Editing operador:', operador); // Ensure operador has a valid id here for debugging
      openModal('operadorModal', true, operador);
    } else {
      console.error('Operador object is missing id:', operador);
    }
  };

  const handleAddRow = () => {
    setCurrencyData((prevData) => [
      ...prevData,
      { Serie: '', Cantidad: 0, Saldo: 0 },
    ]);
  };

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

  const handleCajaSubmit = async () => {
    try {
      // Ensure divisa is set
      if (!divisa) {
        throw new Error("divisa_id is required.");
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
      const newCaja: Partial<Caja> = {
        divisa_id: divisa,
        billetes: { billetes },
        fecha_inicio: new Date().toISOString(),
        estatus: true,
      };

      // Call the addCaja service to add the new caja
      await addCaja(newCaja);
      console.log("Caja added successfully!");

      // Optionally refetch data or close the modal
      const updatedCajas = await fetchCajasData();
      setCajasData(updatedCajas);
      closeModal();
    } catch (error) {
      console.error("Error adding caja: ", error.message);
    }
  };

  return (
    <main className="flex bg-qt_light min-h-screen">
      <div className='p-5 w-full max-w-full'>
        <H1 className='text-left tracking-tight mb-1'>Administracion de Sucursales</H1>
        <P className='text-sm mb-4'>al día {CurrentDateMXN()}</P>
        {/* SUCURSALES ----------------------------------------------------------------*/}
        <GrilledTable
          title={<div className='flex justify-between items-center mb-1'>
            <H1 className='text-xl'>Sucursales</H1>
            <Button
              className='space-x-8'
              onClick={() => openModal('sucursalModal')}
            >
              <span>Agregar Sucursal</span><span>+</span>
            </Button>
          </div>}
          columns={[
            { header: 'Nombre', key: 'nombre' },
            { header: 'Correo electrónico', key: 'correo' },
            { header: 'Dirección', key: 'direccion' },
            { header: '', key: 'edit', render: (row) => <IconButton icon={<EditIcon />} /> },
          ]}
          rows={sucursalesData.map((sucursal) => ({
            key: sucursal.id,
            nombre: sucursal.nombre,
            correo: sucursal.email,
            direccion: sucursal.direccion
          }))}
          className='mb-8'
        />
        {/* PRODUCTOS ----------------------------------------------------------------*/}
        <GrilledTable
          title={<div className='flex justify-between items-center mb-1'>
            <H1 className='text-xl'>Productos</H1>
            <Button
              className='space-x-8'
              onClick={() => openModal('productoModal')}
            >
              <span>Agregar Producto</span><span>+</span>
            </Button>
          </div>}
          columns={[
            { header: 'Sucursal', key: 'sucursal' },
            { header: 'Productos', key: 'producto' },
            { header: 'Monto VIP', key: 'vip', divided: true },
            { header: 'Monto Autorización', key: 'autorizacion' },
            { header: 'Tipo de cambio compra', key: 'compra' },
            { header: 'Límite inferior', key: 'cinferior' },
            { header: 'Límite superior', key: 'csuperior' },
            { header: 'Tipo de cambio venta', key: 'venta' },
            { header: 'Límite inferior', key: 'vinferior' },
            { header: 'Límite superior', key: 'vsuperior' },
            { header: '', key: 'edit', render: (row) => <IconButton icon={<EditIcon />} /> },
          ]}
          rows={[
            { sucursal: 'Interlomas', producto: 'Dólar', vip: '5000', autorizacion: '1600', compra: '$17.60', cinferior: '$17.60', csuperior: '$18.00', venta: '$17.60', vinferior: '$17.60', vsuperior: '$18.00' },
            { sucursal: 'Interlomas', producto: 'Euro', vip: '3500', autorizacion: '1000', compra: '$17.60', cinferior: '$17.60', csuperior: '$18.00', venta: '$17.60', vinferior: '$17.60', vsuperior: '$18.00' },
            { sucursal: 'Interlomas', producto: 'Libra', vip: '3000', autorizacion: '1200', compra: '$17.60', cinferior: '$17.60', csuperior: '$18.00', venta: '$17.60', vinferior: '$17.60', vsuperior: '$18.00' },
            { sucursal: 'Interlomas', producto: 'Franco', vip: '3000', autorizacion: '1200', compra: '$17.60', cinferior: '$17.60', csuperior: '$18.00', venta: '$17.60', vinferior: '$17.60', vsuperior: '$18.00' },
          ]}
          className='mb-8'
        />
        {/* OPERADORES ----------------------------------------------------------------*/}
        <GrilledTable
          title={<div className='flex justify-between items-center mb-1'>
            <H1 className='text-xl'>Operadores</H1>
            <Button
              className='space-x-8'
              onClick={() => openModal('operadorModal')}
            >
              <span>Agregar Operador</span><span>+</span>
            </Button>
          </div>}
          columns={[
            { header: 'Sucursal', key: 'sucursal' },
            { header: 'Nombre', key: 'nombre' },
            { header: 'Apellido Paterno', key: 'apellidoPaterno' },
            { header: 'Apellido Materno', key: 'apellidoMaterno' },
            { header: 'Teléfono', key: 'telefono' },
            {
              header: '', key: 'edit', render: (row) => <IconButton
                icon={<EditIcon />}
                onClick={() => handleEditOperadorEntry(row.operadorData)}
              />
            },
          ]}
          rows={operadoresData.map((operador) => {
            const sucursal = sucursalesData.find(
              (sucursal) => sucursal.id === operador.sucursal_id
            );
            return {
              key: operador.id,
              id: operador.id,
              sucursal: sucursal ? sucursal.nombre : '!', // Display the name
              nombre: operador.nombre,
              apellidoPaterno: operador.apellidoPaterno,
              apellidoMaterno: operador.apellidoMaterno,
              telefono: operador.telefono,
              operadorData: operador,
            };
          })}
          className='mb-8'
        />
        {/* SALDOS ---------------------------------------------------------------------*/}
        <GrilledTable
          title={<div className='flex justify-between items-center mb-1'>
            <H1 className='text-xl'>Saldos</H1>
          </div>}
          columns={[
            { header: 'Sucursal', key: 'sucursal' },
            { header: 'Producto', key: 'producto' },
            { header: 'Saldo Inicial', key: 'inicial' },
            { header: 'Saldo Final', key: 'final' },
            { header: 'Fecha', key: 'fecha' },
            { header: '', key: 'edit', render: (row) => <IconButton icon={<EditIcon />} /> },
          ]}
          rows={[
            { sucursal: 'Interlomas' },
            { sucursal: 'Interlomas' },
            { sucursal: 'Interlomas' },
            { sucursal: 'Interlomas' },
          ]}
          className='mb-8'
        />
        {/* CAJAS ----------------------------------------------------------------*/}
        <GrilledTable
          title={<div className='flex justify-between items-center mb-1'>
            <H1 className='text-xl'>Cajas</H1>
            <Button
              className='space-x-16'
              onClick={() => openModal('cajaModal')}
            >
              <span>Agregar Caja</span>
              <span>+</span>
            </Button>
          </div>}
          columns={[
            { header: 'Sucursal', key: 'sucursal' },
            { header: 'Divisa', key: 'divisa' },
            { header: 'Serie', key: 'serie' },
            { header: 'Cantidad inicial', key: 'inicial' },
            { header: 'Cantidad final', key: 'final' },
            { header: 'Estatus', key: 'estatus' },
            { header: '', key: 'edit', render: (row) => <IconButton icon={<EditIcon />} /> },
          ]}
          rows={cajasData.map((caja) => ({
            id: caja.id,
            sucursal: caja.sucursal_id,
            divisa: caja.divisa_id,
            serie: caja.id,
          }))}
          className='mb-8'
        />
        {/* SUPERVISORES ----------------------------------------------------------------*/}
        <GrilledTable
          title={<div className='flex justify-between items-center mb-1'>
            <H1 className='text-xl'>Supervisores</H1>
            <Button
              className='space-x-8'
              onClick={() => openModal('supervisorModal')}
            ><span>Agregar Supervisor</span><span>+</span></Button>
          </div>}
          columns={[
            { header: 'Sucursal', key: 'sucursal' },
            { header: 'Nombre', key: 'nombre' },
            { header: 'Teléfono', key: 'telefono' },
            { header: 'Email', key: 'email' },
            { header: '', key: 'edit', render: (row) => <IconButton icon={<EditIcon />} /> },
          ]}
          rows={[
            { sucursal: 'Interlomas', nombre: 'Francisco Mora', telefono: '55 1234 5678', email: 'fmora@gmail.com' },
            { sucursal: 'Interlomas' },
            { sucursal: 'Sanje' },
            { sucursal: 'Sanje' },
          ]}
          className='mb-4'
        />
        {/* MODALS ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
        {/* Sucursal Express */}
        <Modal
          isVisible={activeModal === 'sucursalModal'}
          onClose={closeModal}
          defaultCloseButton
          className='px-8 py-6' // w-[600px] h-[500px]' // Fixed size for consistency between steps
        >
          <H1 className='text-left tracking-tight mb-1'>Datos de la sucursal</H1>
          <P className='text-sm mb-10'>Sigue los pasos a continuación:</P>
          <Input
            label="Correo electrónico"
            placeholder="Correo electrónico *"
            value={newSucursal.email}
            onChange={handleSucursalInputChange('email')}
          />
          <Input
            label="Contraseña"
            placeholder="Contraseña *"
            value={newSucursal.password}
            onChange={handleSucursalInputChange('password')}
          />
          <Input
            label="Nombre de la sucursal"
            placeholder="Nombre de la sucursal *"
            value={newSucursal.nombre}
            onChange={handleSucursalInputChange('nombre')}
          />
          <Input
            label="Presupuesto"
            placeholder="Presupuesto *"
            value={newSucursal.presupuesto.toString()}
            onChange={(e) => handleSucursalInputChange('presupuesto')(e as any)}
          />
          <Input
            label="Direccion"
            placeholder="Direccion *"
            value={newSucursal.direccion}
            onChange={handleSucursalInputChange('direccion')}
          />
          <Input
            label="Estado"
            placeholder="Estado *"
            value={newSucursal.estado}
            onChange={handleSucursalInputChange('estado')}
          />
          <Input
            label="Teléfono"
            placeholder="Teléfono *"
            value={newSucursal.telefono}
            onChange={handleSucursalInputChange('telefono')}
            className='mb-6'
          />
          <Button
            onClick={handleSucursalExpressSubmit}
          >
            Crear Sucursal Express
          </Button>
        </Modal>
        {/* Agregar Sucursal */}
        <Modal
          isVisible={activeModal === 'sucursal2Modal'} // DEBUG
          onClose={closeModal}
          className='px-8 py-6' // w-[600px] h-[500px]' // Fixed size for consistency between steps
        >
          <H1 className='text-left tracking-tight mb-1'>Datos de la sucursal</H1>
          <P className='text-sm mb-10'>Sigue los pasos a continuación:</P>
          <Stepper
            steps={[
              { label: 'Datos' },
              { label: 'Saldos' },
              { label: 'Cajas' },
              { label: 'Operadores' },
              { label: 'Tipos de cambio' },
            ]}
            currentStep={currentStep}
            className='mb-10'
          />
          {/* Contenido dinámico según el paso actual. */}
          <div className='grid grid-cols-3 gap-x-16 gap-y-6 mb-10'>
            {/* 1 Datos -------------------------- */}
            {currentStep === 0 && (
              <>
                <Input
                  label="Correo"
                  placeholder="Correo *"
                  value={newSucursal.email}
                  onChange={handleSucursalInputChange('email')}
                />
                <Input
                  label="Contraseña"
                  placeholder="Contraseña *"
                  type="password"
                  value={newSucursal.password}
                  onChange={handleSucursalInputChange('password')}
                />
                <Input
                  label="Confirmar Contraseña"
                  placeholder="Confirmar Contraseña *"
                  type="password"
                // No need to store this value, just validate
                />
                <Input
                  label="Nombre de la sucursal"
                  placeholder="Nombre de la sucursal *"
                  value={newSucursal.nombre}
                  onChange={handleSucursalInputChange('nombre')}
                />
                <Input
                  label="Teléfono"
                  placeholder="Teléfono *"
                  value={newSucursal.telefono}
                  onChange={handleSucursalInputChange('telefono')}
                />
                <Input
                  label="Presupuesto"
                  placeholder="Presupuesto *"
                  value={newSucursal.presupuesto.toString()}
                  onChange={(e) => handleSucursalInputChange('presupuesto')(e as any)}
                />
                <Input
                  label="Calle"
                  placeholder='Calle *'
                  value={direccionData.calle}
                  onChange={handleAddressChange('calle')}
                  className='col-span-2'
                />
                <Input
                  label="Número Exterior"
                  placeholder="Número Exterior *"
                  value={direccionData.numeroExterior}
                  onChange={handleAddressChange('numeroExterior')}
                />
                <Input
                  label="Código Postal *"
                  placeholder="Código Postal *"
                  value={direccionData.codigoPostal}
                  onChange={handleAddressChange('codigoPostal')}
                />
                <Input
                  label="Municipio *"
                  placeholder="Municipio *"
                  value={direccionData.municipio}
                  onChange={handleAddressChange('municipio')}
                />
                <Input
                  label="Estado *"
                  placeholder="Estado *"
                  value={newSucursal.estado}
                  onChange={handleSucursalInputChange('estado')}
                />
              </>
            )}
            {/* 2 Saldos ------------------------- */}
            {currentStep === 1 && (
              <>
                <GrilledTable
                  title={
                    <P className='text-sm -mb-3 col-span-3'>Llena los campos con la información solicitada</P>
                  }
                  columns={[
                    { header: 'Producto', key: 'producto' },
                    { header: 'Mnemónico', key: 'mnemo' },
                    { header: 'Color Asociado', key: 'color', render: (row) => <ColorSelect /> },
                    { header: 'Saldo inicial', key: 'saldo' },
                    { header: '', key: 'editar', render: (row) => <IconButton icon={<CancelIcon />} /> }
                  ]}
                  rows={[
                    { producto: 'Pesos', mnemo: 'MXN', saldo: '1500' },
                    { producto: 'Pesos', mnemo: 'MXN', saldo: '1500' }
                  ]}
                  className='col-span-3'
                />
              </>
            )}
            {/* 3 Cajas -------------------------- */}
            {currentStep === 2 && (
              <div className='col-span-3 gap-4 grid grid-cols-2'>
                <AccentTable
                  header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Caja de <span className='text-qt_blue inline'>pesos (MXN)</span></H1>}
                  columns={[
                    { header: 'Serie', key: 'Serie' },
                    {
                      header: 'Cantidad', key: 'Cantidad',
                      render: (row: Currency) => (
                        <QuantityInput
                          initialValue={row.Cantidad}
                          max={999}
                        />)
                    },
                    { header: 'Saldo', key: 'Saldo', render: (row: Currency) => ((row.Saldo)) }
                  ]}
                  rows={[]}
                  footer={
                    <div className='flex justify-between'>
                      <KeyValuePair keyName='Diferencia' value='0' />
                      <KeyValuePair keyName='Total' value='0' />
                    </div>
                  }
                  className='w-full'
                />
                {/* DÓLARES */}
                <AccentTable
                  header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Caja de <span className='text-qt_blue inline'>dólares (USD)</span></H1>}
                  columns={[
                    { header: 'Serie', key: 'Serie' },
                    {
                      header: 'Cantidad', key: 'Cantidad',
                      render: (row: Currency) => (
                        <QuantityInput
                          initialValue={row.Cantidad}
                          max={999}
                        />)
                    },
                    { header: 'Saldo', key: 'Saldo', render: (row: Currency) => ((row.Saldo)) }
                  ]}
                  rows={[]}
                  footer={
                    <div className='flex justify-between'>
                      <KeyValuePair keyName='Diferencia' value='0' />
                      <KeyValuePair keyName='Total' value='0' />
                    </div>
                  }
                  className='w-full'
                />
              </div>
            )}
            {/* 4 Operadores --------------------- */}
            {currentStep === 3 && (
              <>
                <GrilledTable
                  columns={[
                    { header: 'Nombre', key: 'nombre' },
                    { header: 'Apellido Paterno', key: 'paterno' },
                    { header: 'Apellido Materno', key: 'materno' },
                    { header: 'Teléfono', key: 'telefono' },
                    { header: '', key: 'editar', render: (row) => <IconButton icon={<EditIcon />} /> }
                  ]}
                  rows={[
                    { nombre: 'Julieta', paterno: 'Navarro', telefono: '55 3904 8969' },
                    { nombre: 'Francisco', paterno: 'Paci', materno: 'Jiménez', telefono: '55 5436 7408' },
                  ]}
                  className='col-span-3'
                />
              </>
            )}
            {/* 5 Tipos de cambio ---------------- */}
            {currentStep === 4 && (
              <>
                <GrilledTable
                  columns={[
                    { header: 'Producto', key: 'producto' },
                    { header: 'Monto VIP', key: 'vip' },
                    { header: 'Monto Autorización', key: 'autorizacion' },
                    { header: 'Tipo de cambio', key: 'cambio' },
                    { header: 'Límite Inferior', key: 'inferior' },
                    { header: 'Límite Superior', key: 'superior' },
                  ]}
                  rows={[
                    { producto: 'Pesos', vip: '25000', autorizacion: '18000', cambio: 'N/A', inferior: 'N/A', superior: 'N/A' },
                    { producto: 'Dólar', vip: '5000', autorizacion: '1600', cambio: '17.50', inferior: '17.40', superior: '17.65' },
                  ]}
                  className='col-span-3'
                />
              </>
            )}
          </div>
          <div className='flex justify-between items-center w-full'>
            <div className='flex items-center space-x-6'>
              <SlideSwitch />
              <P className='text-qt_primary'>Sucursal Virtual</P>
            </div>
            <div className='flex space-x-4'>
              {/* Button to cancel or go back*/}
              <Button
                className='bg-qt_mid text-qt_dark'
                onClick={handlePrevStep}
              >
                {currentStep === 0 ? 'Cancelar' : 'Atrás'}
              </Button>
              {/* Button to go forward or submit */}
              <Button
                onClick={handleNextStep}
              >
                {currentStep === 4 ? 'Finalizar' : 'Continuar'}
              </Button>
            </div>
          </div>
        </Modal>
        {/* Agregar Producto */}
        <Modal
          isVisible={activeModal === 'productoModal'}
          onClose={closeModal}
          // defaultCloseButton // Debugging
          className='px-8 py-6'
        >
          <H1 className='text-left tracking-tight mb-1'>Agregar Producto</H1>
          <P className='text-sm mb-10'>Puedes modificarlo en la tabla más tarde.</P>
          <div className='grid grid-cols-3 gap-x-16 gap-y-6 mb-10'>
            {[
              { label: 'Sucursal', placeholder: 'Sucursal *' },
              { label: 'Nombre', placeholder: 'Nombre *' },
              { label: 'Mnemónico', placeholder: 'Mnemónico *' },
              { label: 'Color asociado', placeholder: '#FFFFFF' },
              { label: 'Saldo Inicial', placeholder: 'Saldo Inicial *' },
              { label: 'Monto VIP', placeholder: 'Monto VIP *' },
              { label: 'Monto autorización', placeholder: 'Monto autorización *' },
              { label: 'Tipo de cambio inicial', placeholder: 'Tipo de cambio *' },
              { label: 'Límite inferior tipo de cambio', placeholder: 'Lím Inferior *' },
              { label: 'Límite superior tipo de cambio', placeholder: 'Lím Superior*' },
            ].map((inputProps, index) => (
              <Input
                key={index}
                label={inputProps.label}
                placeholder={inputProps.placeholder}
              />
            ))}
          </div>
          <div className='flex justify-end items-end w-full'>
            <div className='flex space-x-4'>
              <Button
                className='bg-qt_mid text-qt_dark'
                onClick={closeModal}
              >
                Cancelar</Button>
              <Button>Registrar</Button>
            </div>
          </div>
        </Modal>
        {/* Agregar Operador */}
        <Modal
          isVisible={activeModal === 'operadorModal'}
          onClose={closeModal}
          className="px-8 py-6"
        >
          <H1 className="text-left tracking-tight mb-1">
            {isEditing ? `Editar Operador` : 'Agregar Operador'}
          </H1>
          <P className="text-sm mb-10">Llena los campos solicitados a continuación.</P>
          <div className="grid grid-cols-2 gap-x-16 gap-y-6 mb-10">
            {[
              { label: 'Nombre(s)', key: 'nombre', placeholder: 'Nombre(s) *', value: newOperador.nombre },
              { label: 'Apellido Paterno', key: 'apellidoPaterno', placeholder: 'Apellido Paterno *', value: newOperador.apellidoPaterno },
              { label: 'Apellido Materno', key: 'apellidoMaterno', placeholder: 'Apellido Materno *', value: newOperador.apellidoMaterno },
              { label: 'Teléfono', key: 'telefono', placeholder: 'Teléfono', value: newOperador.telefono },
            ].map((inputProps, index) => (
              <Input
                key={index}
                label={inputProps.label}
                placeholder={inputProps.placeholder}
                value={inputProps.value}
                onChange={(event) => handleOperadorInputChange(inputProps.key as keyof Operador)(event)}
              />
            ))}
            <Select
              label="Sucursal"
              placeholder="Sucursal del operador"
              options={sucursalOptions}
              value={newOperador.sucursal_id}
              onChange={(selectedValue) => setNewOperador((prev) => ({ ...prev, sucursal_id: selectedValue}))}
              className="col-span-2"
            />
          </div>
          <div className="flex justify-end items-end w-full">
            <div className="flex space-x-4">
              <Button className="bg-qt_mid text-qt_dark" onClick={closeModal}>
                Cancelar
              </Button>
              <Button onClick={handleOperadorData}>
                {isEditing ? 'Guardar Cambios' : 'Registrar'}
              </Button>
            </div>
          </div>
        </Modal>
        {/* Agregar Caja */}
        <Modal
          isVisible={activeModal === 'cajaModal'}
          onClose={closeModal}
        >
          <H1 className='text-left tracking-tight mb-1'>Agregar Caja</H1>
          <P className='text-sm mb-10'>Ingresa las series y cantidades, se indicará si esto coincide con el saldo.</P>
          <div className='grid grid-cols-3 gap-x-8 gap-y-6 mb-8'>
            <Input
              label='Sucursal'
              placeholder='Sucursal *'
              onChange={(e) => setDivisa(e.target.value)}
            />
            <Input
              label='Divisa'
              placeholder='Divisa *'
              onChange={(e) => setDivisa(e.target.value)}
            />
            <Input
              label='Saldo de la divisa'
              placeholder='17,650.00'
              type='number'
              value={saldoInicial}
              onChange={(e) => setSaldoInicial(Number(e.target.value) || 0)}
            />
          </div>
          <AccentTable
            header={
              <H1 className='text-base text-qt_primary mb-4 pl-2'>
                {divisa ? `Caja de ${divisa}` : 'Nueva Caja'}
              </H1>
            }
            columns={[
              {
                header: 'Serie', key: 'Serie', width: '1px',
                render: (row: Currency) => (
                  <Input
                    className='m-0'
                    value={row.Serie}
                    placeholder='Cifra de la serie *'
                    onChange={(e) => handleRowChange(currencyData.indexOf(row), 'Serie', e.target.value)}
                  />
                )
              },
              {
                header: 'Cantidad', key: 'Cantidad', width: '1px',
                render: (row: Currency) => (
                  <QuantityInput
                    initialValue={row.Cantidad}
                    max={999}
                    onChange={(newCantidad) => handleRowChange(currencyData.indexOf(row), 'Cantidad', newCantidad ?? 0)}
                  />)
              },
              {
                header: 'Saldo', key: 'Saldo', width: '1px',
                render: (row: Currency) => ((row.Saldo))
              },
              {
                header: '', key: 'Remove', width: '1px',
                render: (row: Currency) => (
                  <IconButton
                    icon={<NoIcon />}
                    onClick={() => handleRemoveRow(currencyData.indexOf(row))}
                  />
                )
              }
            ]}
            rows={currencyData}
            pin={
              <Button onClick={handleAddRow}>Agregar serie</Button>
            }
            footer={
              <div className='flex justify-between'>
                <KeyValuePair keyName='Diferencia' value={difference.toLocaleString()} />
                <KeyValuePair keyName='Total' value={calculatedTotal.toLocaleString()} />
              </div>
            }
            className='mb-8 w-full'
          />
          {/* Warnings */}
          <div className='mb-6 space-y-2'>
            {difference !== 0 && (
              <div className='bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg p-2'>
                La diferencia entre el saldo ingresado y el saldo calculado no es cero.
              </div>
            )}
            {currencyData.length === 0 && (
              <div className='bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg p-2'>
                No se ha definido ninguna serie. Agregue al menos una serie.
              </div>
            )}
            {(!divisa || (saldoInicial ?? 0) <= 0) && (
              <div className='bg-red-100 border border-red-300 text-red-700 text-xs rounded-lg p-2'>
                Todos los campos obligatorios deben estar completos y el saldo debe ser mayor a cero.
              </div>
            )}
          </div>
          <div className='flex justify-end items-end w-full'>
            <div className='flex space-x-4'>
              <Button
                className='bg-qt_mid text-qt_dark'
                onClick={closeModal}
              >
                Cancelar</Button>
              <Button
                onClick={handleCajaSubmit}
              >Registrar</Button>
            </div>
          </div>
        </Modal>
        {/* Agregar Supervisor */}
        <Modal
          isVisible={activeModal === 'supervisorModal'}
          onClose={closeModal}
          // defaultCloseButton // Debugging
          className='px-8 py-6'
        >
          <H1 className='text-left tracking-tight mb-1'>Agregar Supervisor</H1>
          <P className='text-sm mb-10'>Llena los campos solicitados a continuación.</P>
          <div className='grid grid-cols-3 gap-x-16 gap-y-6 mb-10'>
            {[
              { label: 'Nombre', placeholder: 'Nombre *' },
              { label: 'Apellido Paterno', placeholder: 'Apellido Paterno *' },
              { label: 'Apellido Materno', placeholder: 'Apellido Materno *' },
              { label: 'Email', placeholder: 'Email *', className: 'col-span-2' },
              { label: 'Teléfono', placeholder: 'Teléfono' },
            ].map((inputProps, index) => (
              <Input
                key={index}
                label={inputProps.label}
                placeholder={inputProps.placeholder}
                className={inputProps.className}
              />
            ))}
          </div>
          <div className='flex justify-end items-end w-full'>
            <div className='flex space-x-4'>
              <Button
                className='bg-qt_mid text-qt_dark'
                onClick={closeModal}
              >
                Cancelar</Button>
              <Button>Registrar</Button>
            </div>
          </div>
        </Modal>
      </div>
    </main>
  );
}