'use client';

import { useEffect } from 'react';
import { GrilledTable, H1, IconButton, P } from "@components";
import { EditIcon } from '@icons';
import { CurrentDateMXN } from '@utils';
import { fetchCajasData } from '@service/caja'
import { fetchDivisasData } from '@service/divisa'
import SupervisoresManager from '@components/supervisor/managers/supervisores_manager';
import OperadoresManager from '@components/supervisor/managers/operadores_manager';
import SucursalesManager from '@components/supervisor/managers/sucursales_manager';
import DivisasManager from '@app/_components/supervisor/managers/divisas_manager';
import CajasManager from '@app/_components/supervisor/managers/cajas_manager';

export default function Sucursales() {
  return (
    <main className="flex bg-qt_light min-h-screen">
      <div className='p-5 w-full max-w-full'>
        <H1 className='text-left tracking-tight mb-1'>Administracion de Sucursales</H1>
        <P className='text-sm mb-4'>al día {CurrentDateMXN()}</P>
        <SucursalesManager className='mb-8'/>
        <DivisasManager className='mb-8'/>
        <OperadoresManager className='mb-8'/>
        
        {/* <GrilledTable
          title={<div className='flex justify-between items-center mb-1'>
            <H1 className='text-xl'>Saldos</H1>
          </div>}
          columns={[
            { header: 'Sucursal', key: 'sucursal' },
            { header: 'Divisa', key: 'divisa' },
            { header: 'Saldo Inicial', key: 'inicial', divided: true},
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
        /> */}
        <CajasManager className='mb-8'/>
        <SupervisoresManager className='mb-8'/>
        {/* MODALS ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */}
        {/* Agregar Sucursal */}
        {/* <SucursalModal
          isVisible={activeModal === 'sucursalModal'}
          closeModal={closeModal}
          handleSucursalSubmit={handleSucursalSubmit}
          handleInputChange={handleSucursalInputChange}
          handleAddressChange={handleAddressChange}
          newSucursal={newSucursal}
          direccionData={direccionData}
          currentStep={currentStep}
          handlePrevStep={handlePrevStep}
          handleNextStep={handleNextStep}
        /> */}
      </div>
    </main>
  );
}