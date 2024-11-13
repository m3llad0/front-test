import { EditIcon, EyeIcon } from '@app/_icons';
import { H1, IconButton, Input, P, Select, GrilledTable, Button } from '@components'
import { CurrentDateMXN } from '@utils';

export default function Page() {

  const operacionOptions = [
    { value: 'compra', label: 'Compra' },
    { value: 'venta', label: 'Venta' },
  ];

  const productoOptions = [
    { value: 'usd', label: 'USD' },
    { value: 'mxn', label: 'MXN' },
  ];

  return (
    <main className="flex bg-qt_light min-h-screen">
      <div className='p-5 w-full max-w-full'>
        <H1 className='text-left tracking-tight mb-1'>Ingresos y gastos</H1>
        <P className='text-sm mb-4'>al día {CurrentDateMXN()}</P>
        {/* Filtrar */}
        <div className='bg-white rounded-lg border border-qt_mid p-5 grid grid-cols-4 gap-x-6 gap-y-6 mb-4'>
          <Select className='text-qt_dark text-sm rounded-xl' options={operacionOptions} placeholder='Operación' />
          <Select className='text-qt_dark text-sm rounded-xl' options={productoOptions} placeholder='Sucursal' />
          <Select className='text-qt_dark text-sm rounded-xl' options={productoOptions} placeholder='Divisa' />
          {/* <Select className='text-qt_dark text-sm rounded-xl' options={productoOptions} placeholder='Operador' /> */}
          <Input className='text-qt_dark text-sm rounded-xl' placeholder='Rango de fechas' />
        </div>
        <GrilledTable
          columns={[
            { header: 'ID', key: 'id' },
            { header: 'Sucursal', key: 'sucursal' },
            { header: 'Divisa', key: 'divisa' },
            { header: 'Fecha', key: 'fecha' },
            { header: 'Hora', key: 'hora' },
            { header: 'Operación', key: 'operacion' },
            { header: 'Concepto', key: 'concepto' },
            { header: 'Monto', key: 'monto' },
            { header: '', key: 'ver', render: (row) => <IconButton icon={<EyeIcon />} /> }
          ]}
          rows={[
            { id: '28', sucursal: 'Interlomas', divisa: 'USD', fecha: '21/07/23', hora: '16:06', operacion: 'Ingreso', concepto: 'Donativo', monto: '17.00' }
          ]}
          footer={
            <div className='flex justify-between'>
              <div className={`flex items-center space-x-2`}>
                <P className='text-sm text-qt_primary font-bold'>Total<span className='text-qt_blue inline'> USD</span></P>
                <P className='text-sm text-qt_dark font-normal'>$ 8,010</P>
              </div>
              <div className={`flex items-center space-x-2`}>
                <P className='text-sm text-qt_primary font-bold'>Total<span className='text-qt_blue inline'> MXN</span></P>
                <P className='text-sm text-qt_dark font-normal'>$ 8,010</P>
              </div>
              <Button
                className='space-x-8'
              >
                <span>Registrar movimiento</span><span>+</span>
              </Button>
            </div>
          }
          className='mb-6'
        />
        <div className='flex justify-between items-center mb-1'>
          <H1 className='text-xl'>Catálogo de Conceptos</H1>
        </div>
        <div className='bg-white rounded-lg border border-qt_mid p-5 grid grid-cols-4 gap-x-6 gap-y-6 mb-4 items-center align-middle'>
          <Select className='text-qt_dark text-sm rounded-xl' options={operacionOptions} placeholder='Tipo de operación' />
          <Select className='text-qt_dark text-sm rounded-xl col-span-2' options={productoOptions} placeholder='Concepto' />
          {/* <Select className='text-qt_dark text-sm rounded-xl' options={productoOptions} placeholder='Operador' /> */}
          <Button className='py-[5px]'>
            Registrar concepto
          </Button>
        </div>
        <div className='bg-white rounded-lg border  border-qt_mid  p-5 grid grid-cols-2 gap-x-6 gap-y-6 mb-4 items-center align-middle'>
          <div>
            <H1 className='text-xl mb-1'>Ingreso</H1>
            <GrilledTable
              columns={[
                { header: 'ID', key: 'id' },
                { header: 'Concepto', key: 'concepto' },
                { header: 'Fecha', key: 'fecha' },
                { header: '', key: 'ver', render: (row) => <IconButton icon={<EditIcon />} /> }
              ]}
              rows={[
                { id: '28', sucursal: 'Interlomas', divisa: 'USD', fecha: '21/07/23', hora: '16:06', operacion: 'Ingreso', concepto: 'Donativo', monto: '17.00' }
              ]}
              className='col-span-1'
            />
          </div>
          <div>
            <H1 className='text-xl mb-1'>Egreso</H1>
            <GrilledTable
              columns={[
                { header: 'ID', key: 'id' },
                { header: 'Concepto', key: 'concepto' },
                { header: 'Fecha', key: 'fecha' },
                { header: '', key: 'ver', render: (row) => <IconButton icon={<EditIcon />} /> }
              ]}
              rows={[
                { id: '28', sucursal: 'Interlomas', divisa: 'USD', fecha: '21/07/23', hora: '16:06', operacion: 'Ingreso', concepto: 'Pago de Luz', monto: '17.00' }
              ]}
              className='col-span-1'
            />
          </div>
        </div>
      </div>
    </main>
  );
}