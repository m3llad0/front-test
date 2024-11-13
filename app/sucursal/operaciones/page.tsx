'use client'

import { useState } from 'react';
import { AccentTable, Button, GrilledTable, H1, Input, KeyValuePair, Modal, P, QuantityInput, Select, SelectGroup } from '@components';
import { CurrentDateMXN } from '@utils';
import { EyeIcon } from '@icons';

type Currency = {
  Serie: string | number;
  Cantidad: number;
  Saldo: number;
  warning?: string; // In case of discrepancy.
};

export default function Page() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [modalType, setModalType] = useState<'compra' | 'venta' | null>(null);

  const operacionOptions = [
    { value: 'compra', label: 'Compra' },
    { value: 'venta', label: 'Venta' },
  ];

  const productoOptions = [
    { value: 'usd', label: 'USD' },
    { value: 'mxn', label: 'MXN' },
  ];

  const estatusOptions = [
    { value: 'pendiente', label: 'Pendiente' },
    { value: 'completado', label: 'Completado' },
    { value: 'cancelado', label: 'Cancelado' }
  ];

  const openModal = (type: 'compra' | 'venta') => {
    setModalType(type);
    setActiveModal('operacionModal');
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalType(null);
  };

  return (
    <div className='flex flex-col bg-qt_light min-h-screen'>
      <div className='p-5 w-full max-w-full'>
        <H1 className='text-left tracking-tight mb-1'>Operaciones</H1>
        <P className='text-sm mb-4'>del día {CurrentDateMXN()}</P>
        {/* Operaciones */}
        <div className='flex justify-between space-x-4 overflow-x-auto mb-4'>
          <SelectGroup
            columns={[
              { render: () => <Select className='text-qt_dark text-sm rounded-xl' options={operacionOptions} initialValue='Cantidad Recibida *' /> },
              { render: () => <Select className='text-qt_dark text-sm rounded-xl' options={estatusOptions} initialValue='Estatus *' /> },
              { render: () => <Select className='text-qt_dark text-sm rounded-xl' options={productoOptions} initialValue='Clave de operador' /> },
            ]}

          />
        </div>
        <div className='flex justify-between space-x-4 overflow-x-auto mb-4'>
          <GrilledTable
            columns={[
              { header: 'Operador', key: 'operador' },
              { header: 'Producto', key: 'producto' },
              { header: 'Operación', key: 'operación' },
              { header: 'Recibido', key: 'recibido' },
              { header: 'Tipo de cambio', key: 'cambio' },
              { header: 'Entregado', key: 'entregado' },
              { header: 'Estado', key: 'estado' },
            ]}
            rows={[
              { operador: 'ABC123', producto: 'Producto 1', operación: 'Compra', recibido: '1000 MXN', cambio: '20.50', entregado: '50 USD', estado: 'En proceso' },
              { operador: 'DEF456', producto: 'Producto 2', operación: 'Venta', recibido: '2000 MXN', cambio: '21.50', entregado: '100 USD', estado: 'Completado' },
            ]}
            footer={
              <div className='flex justify-between'>
                <P><span className='text-qt_primary font-bold'>Saldo <span className='text-qt_blue'>USD</span>:</span> $8,010</P>
              </div>
            }
            className='w-full'
          />
        </div>
        <H1 className='text-xl mb-4'>Registrar operación</H1>
        <div className='bg-white rounded-lg border  border-qt_mid  p-5 grid grid-cols-2 gap-x-6 gap-y-6 mb-4 items-center align-middle'>
          <Button
            className='bg-[#26AB35] space-x-8'
            onClick={() => openModal('compra')}
          ><span>Nueva compra</span><span>+</span></Button>
          <Button className='space-x-8'><span>Nueva venta</span><span>+</span></Button>
        </div>
      </div>
      {/* Modal */}
      {activeModal === 'operacionModal' && (
        <Modal
          isVisible={true}
          onClose={closeModal}
          className='px-8 py-6'
          defaultCloseButton
          customContentStyle
        >
          {/* Flex container for inputs and table */}
          <div className='flex gap-x-8 mb-10'>
            {/* Inputs Section */}
            <div className='bg-white p-6 rounded-xl shadow-lg w-[55%]'>
              <H1 className='mb-2'>
                Registrar nueva compra
              </H1>
              <P className='mb-8'>
                Se solicitará tu clave de operador para validar el registro de la operación.
              </P>
              <div className='grid grid-cols-2 gap-x-16 gap-y-6'>
                {[
                  { label: 'Divisa', placeholder: 'Dolar (USD)' },
                  { label: 'Tipo de cambio', placeholder: '$ 17.84' },
                  { label: 'Nombre del operador', placeholder: 'Felipe Villegas' },
                  { label: 'Cantidad recibida (USD)', placeholder: '$ 5000' },
                  { label: 'Total entregado MXN', placeholder: '$ 89000' },
                  { label: 'Cliente VIP', placeholder: 'Victor Hernandez' },
                  { label: 'Billete', placeholder: '50 de 100' },
                ].map((inputProps, index) => (
                  <Input
                    key={index}
                    label={inputProps.label}
                    placeholder={inputProps.placeholder}
                  />
                ))}
              </div>
            </div>

            {/* Accent Table Section */}
            <div className='w-[45%] flex flex-col gap-y-8'>
              {/* First Accent Table */}
              <AccentTable
                header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Caja de <span className='text-qt_blue inline'>pesos (MXN)</span></H1>}
                columns={[
                  { header: 'Serie', key: 'Serie' },
                  {
                    header: 'Cantidad', key: 'Cantidad',
                    render: (row: Currency) => (
                      <QuantityInput
                        initialValue={0}
                        max={999}
                      />
                    )
                  },
                  { header: 'Saldo', key: 'Saldo', render: (row: Currency) => ((row.Saldo)) }
                ]}
                rows={[
                  {}
                ]}
                footer={
                  <div className='flex justify-between'>
                    <KeyValuePair keyName='Diferencia' value='0' />
                    <KeyValuePair keyName='Total' value='0' />
                  </div>
                }
                className='w-full'
              />
              {/* Second Accent Table */}
              <AccentTable
                header={<H1 className='text-base text-qt_primary mb-4 pl-2'>Caja de <span className='text-qt_blue inline'>dólares (USD)</span></H1>}
                columns={[
                  { header: 'Serie', key: 'Serie' },
                  {
                    header: 'Cantidad', key: 'Cantidad',
                    render: (row: Currency) => (
                      <QuantityInput
                        initialValue={0}
                        max={999}
                      />
                    )
                  },
                  { header: 'Saldo', key: 'Saldo', render: (row: Currency) => ((row.Saldo)) }
                ]}
                rows={[
                  {}
                ]}
                footer={
                  <div className='flex justify-between'>
                    <KeyValuePair keyName='Diferencia' value='0' />
                    <KeyValuePair keyName='Total' value='0' />
                  </div>
                }
                className='w-full'
              />
          {/* Buttons Section */}
          <div className='flex justify-end space-x-4'>
            <Button className='bg-qt_mid text-qt_dark' onClick={closeModal}>
              Cancelar
            </Button>
            <Button className='bg-qt_primary text-white'>
              Registrar
            </Button>
          </div>
            </div>
          </div>
        </Modal>

      )}
    </div>
  );
}
