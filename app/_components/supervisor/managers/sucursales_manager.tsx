'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button, GrilledTable, H1, IconButton, Input, Modal, P } from "@components";
import { EditIcon, NoIcon } from '@icons';
import { fetchSucursalesData, addSucursal, Sucursal, editSucursal, deleteSucursal, createFirebaseSucursalUser } from '@service/sucursal';

type SucursalesManagerProps = {
  className?: string;
};

const SucursalesManager = ({ className }: SucursalesManagerProps) => {
  const [sucursalesData, setSucursalesData] = useState<Sucursal[]>([]);
  const [activeModal, setActiveModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSucursal, setCurrentSucursal] = useState<Sucursal | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [direccionData, setDireccionData] = useState({
    calle: '',
    numeroExterior: '',
    codigoPostal: '',
    municipio: '',
  });

  // Fetch Sucursales on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sucursales = await fetchSucursalesData();
        setSucursalesData(sucursales);
      } catch (error) {
        console.error('Error fetching sucursales: ', error);
      }
    };
    fetchData();
  }, []);

  const openModal = (sucursal?: Sucursal) => {
    setIsEditing(!!sucursal);
    setCurrentSucursal(
      sucursal || {
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
      }
    );
    setActiveModal(true);
  };

  const closeModal = () => {
    setActiveModal(false);
    setCurrentSucursal(null);
    setError(null);
  };

  const handleInputChange = (key: keyof Sucursal) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCurrentSucursal((prev) => ({
      ...prev!,
      [key]: value,
    }));
  };

  const handleDireccionChange = (key: keyof typeof direccionData) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setDireccionData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);

    try {
      const fullAddress = `${direccionData.calle} ${direccionData.numeroExterior}, ${direccionData.municipio}. ${direccionData.codigoPostal}`;
      const updatedSucursalData = {
        ...currentSucursal,
        direccion: fullAddress,
      };

      // if (isEditing && currentSucursal?.id) {
      //   const firebaseUser = await createFirebaseSucursalUser(updatedSucursalData.email!, updatedSucursalData.password!);
      //   updatedSucursalData.id = firebaseUser.uid;
      //   console.log('sucursal account data', updatedSucursalData);
      //   await editSucursal(updatedSucursalData as Sucursal);
      // } else {
        console.log('Creating new Firebase user and Sucursal', updatedSucursalData);
        // Step 1: Creating Firebase user
        const firebaseUser = await createFirebaseSucursalUser(updatedSucursalData.email!, updatedSucursalData.password!);
        updatedSucursalData.id = firebaseUser.uid;
        console.log('Firebase user created with UID:', firebaseUser.uid);

        // Step 2: Creating db entry
       
        await addSucursal(updatedSucursalData as Sucursal);
        console.log('Sucursal successfully added:', updatedSucursalData);
      // }

      const updatedSucursales = await fetchSucursalesData();
      setSucursalesData(updatedSucursales);
      closeModal();
    } catch (err) {
      console.error('Error processing request', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteSucursal(id);
      setSucursalesData((prevData) => prevData.filter((sucursal) => sucursal.id !== id));
      console.log(`Sucursal with id ${id} deleted successfully`);
    } catch (error) {
      setError('Error deleting sucursal');
      console.error('Error deleting sucursal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <GrilledTable
        title={
          <div className='flex justify-between items-center mb-1'>
            <H1 className='text-xl'>Sucursales</H1>
            <Button onClick={() => openModal()} className='space-x-8'>
              <span>Agregar Sucursal</span>
              <span>+</span>
            </Button>
          </div>
        }
        columns={[
          { header: 'Nombre', key: 'nombre' },
          { header: 'Correo electrónico', key: 'correo' },
          { header: 'Dirección', key: 'direccion' },
          {
            header: '',
            key: 'edit',
            render: (row) => <IconButton icon={<EditIcon />} onClick={() => openModal(row.sucursalData)} />,
          },
          {
            header: '',
            key: 'delete',
            render: (row) => (
              <IconButton icon={<NoIcon />} onClick={() => handleDelete(row.key)} />
            ),
          },
        ]}
        rows={sucursalesData.map((sucursal) => ({
          key: sucursal.id,
          nombre: sucursal.nombre,
          correo: sucursal.email,
          direccion: sucursal.direccion,
          sucursalData: sucursal,
        }))}
        footer={
          sucursalesData.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No hay datos que mostrar</div>
          ) : null
        }
      />

      {/* Modal for Add/Edit Sucursal */}
      <Modal isVisible={activeModal} onClose={closeModal} className="px-8 py-6">
        <H1 className="text-left tracking-tight mb-10">
          {isEditing ? 'Editar Sucursal' : 'Agregar Sucursal'}
        </H1>

        {error && <P className="text-red-500 mb-4">{error}</P>}

        <div className="grid grid-cols-2 gap-x-16 gap-y-6 mb-10">
          {[
            { label: 'Correo electrónico', key: 'email', placeholder: 'Correo electrónico *', value: currentSucursal?.email || '' },
            { label: 'Contraseña', key: 'password', placeholder: 'Contraseña *', value: currentSucursal?.password || '' },
            { label: 'Nombre de la Sucursal', key: 'nombre', placeholder: 'Nombre de la Sucursal *', value: currentSucursal?.nombre || '' },
            { label: 'Presupuesto', key: 'presupuesto', placeholder: 'Presupuesto *', value: currentSucursal?.presupuesto.toString() || '' },
            { label: 'Teléfono', key: 'telefono', placeholder: 'Teléfono', value: currentSucursal?.telefono || '' },
          ].map((inputProps, index) => (
            <Input
              key={index}
              label={inputProps.label}
              placeholder={inputProps.placeholder}
              value={inputProps.value}
              onChange={handleInputChange(inputProps.key as keyof Sucursal)}
            />
          ))}

          {/* Address fields */}
          {[
            { label: 'Calle', key: 'calle', placeholder: 'Calle *', value: direccionData.calle },
            { label: 'Número Exterior', key: 'numeroExterior', placeholder: 'Número Exterior *', value: direccionData.numeroExterior },
            { label: 'Código Postal', key: 'codigoPostal', placeholder: 'Código Postal *', value: direccionData.codigoPostal },
            { label: 'Municipio/Delegación', key: 'municipio', placeholder: 'Municipio/Delegación *', value: direccionData.municipio },
          ].map((inputProps, index) => (
            <Input
              key={index}
              label={inputProps.label}
              placeholder={inputProps.placeholder}
              value={inputProps.value}
              onChange={handleDireccionChange(inputProps.key as keyof typeof direccionData)}
            />
          ))}
          <Input
            label='Estado'
            placeholder='Estado *'
            value={currentSucursal?.estado}
            onChange={handleInputChange('estado')}
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

export default SucursalesManager;