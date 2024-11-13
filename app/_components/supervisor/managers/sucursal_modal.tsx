// SucursalModal.tsx
import { AccentTable, Button, ColorSelect, GrilledTable, H1, IconButton, Input, KeyValuePair, Modal, P, QuantityInput, SlideSwitch, Stepper } from "@components";
import { CancelIcon, EditIcon } from "@icons";
import { ChangeEvent } from "react";
import { Sucursal } from "@service/sucursal";

interface SucursalModalProps {
  isVisible: boolean;
  closeModal: () => void;
  handleSucursalSubmit: () => void;
  handleInputChange: (key: keyof Sucursal) => (event: ChangeEvent<HTMLInputElement>) => void;
  handleAddressChange: (key: keyof typeof direccionData) => (event: ChangeEvent<HTMLInputElement>) => void;
  newSucursal: Sucursal;
  direccionData: {
    calle: string;
    numeroExterior: string;
    codigoPostal: string;
    municipio: string;
  };
  currentStep: number;
  handleNextStep: () => void;
  handlePrevStep: () => void;
}

export default function SucursalModal({
  isVisible,
  closeModal,
  handleSucursalSubmit,
  handleInputChange,
  handleAddressChange,
  newSucursal,
  direccionData,
  currentStep,
  handleNextStep,
  handlePrevStep
}: SucursalModalProps) {
  const datosInputFields = [
    { label: 'Correo', key: 'email', placeholder: 'Correo *', type: 'text' },
    { label: 'Contraseña', key: 'password', placeholder: 'Contraseña *', type: 'password' },
    { label: 'Confirmar Contraseña', key: 'confirmPassword', placeholder: 'Confirmar Contraseña *', type: 'password' },
    { label: 'Nombre de la sucursal', key: 'nombre', placeholder: 'Nombre de la sucursal *', type: 'text' },
    { label: 'Teléfono', key: 'telefono', placeholder: 'Teléfono *', type: 'text' },
    { label: 'Presupuesto', key: 'presupuesto', placeholder: 'Presupuesto *', type: 'number' },
  ];
  const datosAddressFields = [
    { label: 'Calle', key: 'calle', value: direccionData.calle, onChange: handleAddressChange('calle'), className: 'col-span-2' },
    { label: 'Número Exterior', key: 'numeroExterior', value: direccionData.numeroExterior, onChange: handleAddressChange('numeroExterior') },
    { label: 'Código Postal', key: 'codigoPostal', value: direccionData.codigoPostal, onChange: handleAddressChange('codigoPostal') },
    { label: 'Municipio', key: 'municipio', value: direccionData.municipio, onChange: handleAddressChange('municipio') },
    { label: 'Estado', key: 'estado', value: newSucursal.estado, onChange: handleInputChange('estado') },
  ];

  return (
    <Modal isVisible={isVisible} onClose={closeModal} className='px-8 py-6'>
      <H1>Datos de la sucursal</H1>
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
      <div className='grid grid-cols-3 gap-x-16 gap-y-6 mb-10'>
        {/* 1 Datos -------------------------- */}
        {currentStep === 0 && (
          <>
            {datosInputFields.map((field, index) => (
              <Input
                key={index}
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                value={newSucursal[field.key as keyof Sucursal]?.toString() || ''}
                onChange={handleInputChange(field.key as keyof Sucursal)}
              />
            ))}
            {datosAddressFields.map((field, index) => (
              <Input
                key={index}
                label={field.label}
                value={field.value}
                onChange={field.onChange}
                className={field.className}
              />
            ))}
          </>
        )}
        {/* 2 Saldos ------------------------- */}
        {currentStep === 1 && (
          <>
            <GrilledTable
              title={<P className='text-sm -mb-3 col-span-3'>Llena los campos con la información solicitada</P>}
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
  );
}