import { H1, P, DataBox, GrilledTable, IconButton, Select, SelectGroup, Input } from '@components';
import { EditIcon } from '@icons';
import { fetchOperacionesData, Operacion } from '@service/operacion';

export default async function Page() {
  const operacionOptions = [
    { value: 'compra', label: 'Compra' },
    { value: 'venta', label: 'Venta' },
  ];

  const productoOptions = [
    { value: 'usd', label: 'USD' },
    { value: 'mxn', label: 'MXN' },
  ];

  let operacionesData: Operacion[] = [];
  try {
    operacionesData = await fetchOperacionesData();
  } catch (error) {
    console.error('Error fetching operaciones: ', error);
  }

  const ventasCount = operacionesData.filter(op => op.tipoDeOperacion === 'venta').length;
  const comprasCount = operacionesData.filter(op => op.tipoDeOperacion === 'compra').length;
  const ventasVipCount = operacionesData.filter(op => op.tipoDeOperacion === 'venta' && op.vip).length;
  const intersucursalesCount = operacionesData.filter(op => op.intersucursal).length;

  const operacionesDetails = [
    { header: 'Ventas registradas', value: ventasCount, subtitle: 'actualmente', accent: '#FD0000' },
    { header: 'Compras registradas', value: comprasCount, subtitle: 'actualmente', accent: '#26AB35' },
    { header: 'Ventas VIP', value: ventasVipCount, subtitle: 'actualmente', accent: '#16BFD6' },
    { header: 'Intersucursales', value: intersucursalesCount, subtitle: 'actualmente', accent: '#F765A3' },
  ];

  return (
    <div className='flex bg-qt_light min-h-screen'>
      <div className='p-5 w-full max-w-full overflow-x-auto'>
        <H1 className='text-left tracking-tight mb-1'>Resumen de operaciones</H1>
        <P className='text-sm mb-4'>Revisa aquí los datos de la sucursal.</P>
        {/* Filtrar */}
        <div className='flex justify-between space-x-4 overflow-x-auto mb-4'>
          <SelectGroup
            columns={[
              { render: () => <Select className='text-qt_dark text-sm rounded-xl' options={operacionOptions} placeholder='Operación' /> },
              { render: () => <Select className='text-qt_dark text-sm rounded-xl' options={productoOptions} placeholder='Sucursal' /> },
              { render: () => <Select className='text-qt_dark text-sm rounded-xl' options={productoOptions} placeholder='Divisa' /> },
              { render: () => <Select className='text-qt_dark text-sm rounded-xl' options={productoOptions} placeholder='Operador' /> },
              { render: () => <Input className='text-qt_dark text-sm rounded-xl' placeholder='Rango de fechas' /> },
            ]}
          />
        </div>
        {/* Tarjetas Operaciones */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4'>
          {operacionesDetails.map((detail, index) => (
            <DataBox
              key={index}
              header={detail.header}
              value={detail.value}
              subtitle={detail.subtitle}
              accent={detail.accent}
              className="w-full"
            />
          ))}
        </div>
        <div className='flex justify-between space-x-4 overflow-x-auto mb-4'>
          <SelectGroup
            columns={[
              { render: () => <Select className='text-qt_dark text-sm rounded-xl' options={operacionOptions} placeholder='Sucursal' /> },
              { render: () => <Select className='text-qt_dark text-sm rounded-xl' options={productoOptions} placeholder='Producto' /> },
            ]}
          />
        </div>
        <div className='flex justify-between space-x-4 overflow-x-auto mb-4'>
          <GrilledTable
            columns={[
              { header: 'Sucursal', key: 'operador' },
              { header: 'Producto', key: 'producto' },
              { header: 'Tipo de cambio', key: 'cambio' },
              { header: 'Tipo de cambio', key: 'cambio' },
              { header: 'Ultima Modificación', key: 'estado' },
              { header: '', key: 'edit', render: (row) => <IconButton icon={<EditIcon />} /> },
            ]}
            rows={[
              { operador: 'ABC123', producto: 'Producto 1', operación: 'Compra', recibido: '1000 MXN', cambio: '20.50', entregado: '50 USD', estado: 'En proceso' },
              { operador: 'DEF456', producto: 'Producto 2', operación: 'Venta', recibido: '2000 MXN', cambio: '21.50', entregado: '100 USD', estado: 'Completado' },
            ]}
            footer={<></>}
            className='w-full'
          />
        </div>
      </div>
    </div>
  );
}