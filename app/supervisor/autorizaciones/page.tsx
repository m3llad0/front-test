import { Button, GrilledTable, H1, IconButton, P, Proposal } from "@components";
import { EditIcon } from "@icons";
import { CurrentDateMXN } from '@utils';

export default function Page() {
  return (
    <main className="flex bg-qt_light min-h-screen">
      <div className='p-5 w-full max-w-full overflow-x-auto'>
        <div>
          {/* AUTORIZACIÓN OPERACIONES ----------------------------------------------------------*/}
          <GrilledTable
            title={<div className='flex items-center mb-1'>
              <H1 className='text-xl pl-2 mb-2'>Autorización de operaciones</H1>
              <P className='text-sm pl-2'>al día {CurrentDateMXN()}</P>
            </div>}
            columns={[
              { header: 'ID de Operación', key: 'id' },
              { header: 'Sucursal', key: 'sucursal' },
              { header: 'Operador', key: 'operador' },
              { header: 'Producto', key: 'producto' },
              { header: 'Operación', key: 'operacion' },
              { header: 'Monto solicitado', key: 'direccion'},
              { header: '', key: 'edit', render: (row) => <Button>Revisar</Button> },
            ]}
            rows={[
              { id: 'Interlomas', sucursal: 'Interlomas', operador: 'Hernández', producto: 'Dólar', operacion: 'Compra', cambio: '' },
              { id: 'Interlomas', sucursal: 'Interlomas', operador: 'Hernández', producto: 'Dólar', operacion: 'Compra', cambio: '' },
              { id: 'Interlomas', sucursal: 'Interlomas', operador: 'Hernández', producto: 'Dólar', operacion: 'Compra', cambio: '' },
              { id: 'Interlomas', sucursal: 'Interlomas', operador: 'Hernández', producto: 'Dólar', operacion: 'Compra', cambio: '' },
            ]}
            className='mb-4'
          />
        </div>
      </div>
    </main>
  );
}