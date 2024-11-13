import React from 'react';
import { H1, P, AccentTable, GrilledTable, Select } from '@components';

export default function Page() {
  const currentDate = new Date().toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const operacionOptions = [
    { value: 'compra', label: 'Compra' },
    { value: 'venta', label: 'Venta' },
  ];

  const fechaOptions = [
    { value: '20/08/2024', label: '20/08/2024' },
    { value: '21/08/2024', label: '21/08/2024' },
  ];

  const horaOptions = [
    { value: '10:30', label: '10:30' },
    { value: '11:30', label: '11:30' },
  ];

  const productoOptions = [
    { value: 'Producto 1', label: 'Producto 1' },
    { value: 'Producto 2', label: 'Producto 2' },
  ];

  const cambioOptions = [
    { value: '20.50', label: '20.50' },
    { value: '21.50', label: '21.50' },
  ];

  const MXNOptions = [
    { value: 1000, label: 1000 },
    { value: 2000, label: 2000 },
  ];

  const USDOptions = [
    { value: 50, label: 50 },
    { value: 100, label: 100 },
  ];

  const operadorOptions = [
    { value: 'ABC123', label: 'ABC123' },
    { value: 'DEF456', label: 'DEF456' },
  ];

  return (
    <div className='flex flex-col bg-qt_light min-h-screen'>
      <div className='p-5 w-full max-w-full'>
        <H1 className='text-left tracking-tight mb-1'>Ingresos y gastos</H1>
        <P className='text-sm mb-4'>del día {currentDate}</P>
        {/* Operaciones */}
        <div className='flex justify-between space-x-4 overflow-x-auto mb-4'>
          <AccentTable
            columns={[
              { header: 'Producto', key: 'Producto', render: (row) => <Select options={productoOptions} initialValue={row.operacion} /> },
              { header: 'Tipo de operación', key: 'operacion', render: (row) => <Select options={operacionOptions} initialValue={row.operacion} /> },
              { header: 'Fecha', key: 'fecha', render: (row) => <Select options={fechaOptions} initialValue={row.operacion} /> },
              { header: 'Hora', key: 'hora', render: (row) => <Select options={horaOptions} initialValue={row.operacion} /> },
              { header: 'Tipo de cambio', key: 'cambio', render: (row) => <Select options={cambioOptions} initialValue={row.operacion} /> },
              { header: 'Cantidad recibida MXN', key: 'MXN', render: (row) => <Select options={MXNOptions} initialValue={row.operacion} /> },
              { header: 'Cantidad entregada USD', key: 'USD', render: (row) => <Select options={USDOptions} initialValue={row.operacion} /> },
              { header: 'Clave de operador', key: 'operador', render: (row) => <Select options={operadorOptions} initialValue={row.operacion} /> },
            ]}
            rows={[{operacion: 'compra', fecha: '20/08/2024', hora: '10:30', Producto: 'Producto 1', cambio: '20.50', MXN: 1000, USD: 50, operador: 'ABC123' }]}
            footer={<P className='text-sm'>Última actualización: 12:00</P>}
            className='w-full'
          />
        </div>
        <div className='flex justify-between space-x-4 overflow-x-auto mb-4'>
          <GrilledTable
            columns={[
              { header: 'Operador', key: 'operador'},
              { header: 'Producto', key: 'producto'},
              { header: 'Operación', key: 'operación'},
              { header: 'Recibido', key: 'recibido'},
              { header: 'Tipo de cambio', key: 'cambio'},
              { header: 'Concepto', key: 'concepto'},
              { header: 'Estado', key: 'estado'},
            ]}
            rows={[
              { operador: 'ABC123', producto: 'Producto 1', operación: 'Compra', recibido: '1000 MXN', cambio: '20.50', concepto: 'Compra de producto', estado: 'Pendiente' },
              { operador: 'DEF456', producto: 'Producto 2', operación: 'Venta', recibido: '2000 MXN', cambio: '21.50', concepto: 'Venta de producto', estado: 'Completado' },
            ]}
            footer={<P className='text-sm'>Última actualización: 12:00</P>}
            className='w-full'
          />
        </div>
      </div>

    </div>
  );
}