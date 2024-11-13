'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button, GrilledTable, H1, IconButton, Input, Modal } from "@components";
import { EditIcon, NoIcon } from '@icons';
import { fetchSupervisoresData, addSupervisor, Supervisor, deleteSupervisor, createFirebaseSupervisorUser } from '@service/supervisor';

const SupervisoresManager = ({ className }: { className?: string }) => {
  const [supervisoresData, setSupervisoresData] = useState<Supervisor[]>([]);
  const [activeModal, setActiveModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSupervisor, setCurrentSupervisor] = useState<Supervisor | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch supervisores on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supervisores = await fetchSupervisoresData();
        setSupervisoresData(supervisores);
      } catch (error) {
        console.error('Error fetching supervisores: ', error);
      }
    };
    fetchData();
  }, []);

  const openModal = (supervisor?: Supervisor) => {
    setIsEditing(!!supervisor);
    setCurrentSupervisor(
      supervisor || {
        id: '',
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        telefono: '',
        email: '',
        password: '',
      }
    );
    setActiveModal(true);
  };

  const closeModal = () => {
    setActiveModal(false);
    setCurrentSupervisor(null);
    setError(null);
  };

  const handleInputChange = (key: keyof Supervisor) => (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setCurrentSupervisor((prev) => ({
      ...prev!,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // if (isEditing && currentSupervisor?.id) {
      //   await editSupervisor(currentSupervisor.id, currentSupervisor);
      // } else {
        const firebaseSupervisorUser = await createFirebaseSupervisorUser(currentSupervisor!.email!, '12345678');
        const newSupervisorData = { ...currentSupervisor, id: firebaseSupervisorUser.uid };
        await addSupervisor(newSupervisorData);
      // }

      const updatedSupervisores = await fetchSupervisoresData();
      setSupervisoresData(updatedSupervisores);
      closeModal();
    } catch (err) {
      setError('Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    try {
      await deleteSupervisor(id);
      setSupervisoresData((prevData) => prevData.filter((supervisor) => supervisor.id !== id));
      console.log(`Supervisor with ID ${id} deleted successfully.`);
    } catch (error) {
      setError('Error deleting supervisor');
      console.error('Error deleting supervisor:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      {/* Table of Supervisores */}
      <GrilledTable
        title={<div className='flex justify-between items-center mb-1'>
          <H1 className='text-xl'>Supervisores</H1>
          <Button onClick={() => openModal()} className='space-x-6'><span>Agregar Supervisor</span><span>+</span></Button>
        </div>}
        columns={[
          { header: 'Nombre', key: 'nombre' },
          { header: 'Teléfono', key: 'telefono' },
          { header: 'Email', key: 'email' },
          {
            header: '', key: 'edit', render: (row) => <IconButton
              icon={<EditIcon />}
              onClick={() => openModal(row.supervisorData)}
            />
          },
          {
            header: '', key: 'delete', render: (row) => (
              <IconButton icon={<NoIcon />} onClick={() => handleDelete(row.key)} />
            )
          },
        ]}
        rows={supervisoresData.map((supervisor) => ({
          key: supervisor.id,
          nombre: `${supervisor.nombre} ${supervisor.apellido_paterno} ${supervisor.apellido_materno}`,
          telefono: supervisor.telefono,
          email: supervisor.email,
          supervisorData: supervisor,
        }))}
        footer={
          supervisoresData.length === 0 ? (
            <div className="text-center py-4 text-gray-500">No hay datos que mostrar</div>
          ) : null
        }
      />

      {/* Modal for Add/Edit Supervisor */}
      <Modal isVisible={activeModal} onClose={closeModal} className="px-8 py-6">
        <H1 className="text-left tracking-tight mb-10">
          {isEditing ? 'Editar Supervisor' : 'Agregar Supervisor'}
        </H1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-2 gap-x-16 gap-y-6 mb-10">
          {[{ label: 'Nombre(s)', key: 'nombre', placeholder: 'Nombre(s) *', value: currentSupervisor?.nombre || '' },
            { label: 'Apellido Paterno', key: 'apellido_paterno', placeholder: 'Apellido Paterno *', value: currentSupervisor?.apellido_paterno || '' },
            { label: 'Apellido Materno', key: 'apellido_materno', placeholder: 'Apellido Materno *', value: currentSupervisor?.apellido_materno || '' },
            { label: 'Teléfono', key: 'telefono', placeholder: 'Teléfono *', value: currentSupervisor?.telefono || '' },
            { label: 'Email', key: 'email', placeholder: 'Email *', value: currentSupervisor?.email || '' },
          ].map((inputProps, index) => (
            <Input
              key={index}
              label={inputProps.label}
              placeholder={inputProps.placeholder}
              value={inputProps.value}
              onChange={handleInputChange(inputProps.key as keyof Supervisor)}
            />
          ))}
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

export default SupervisoresManager;