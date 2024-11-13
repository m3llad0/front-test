'use client'

import { ChangeEvent, useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { Button, H1, Input, P } from '@components';
import { useRouter } from 'next/navigation';
import app from '@service/firebaseConfig';
import { EyeIcon, EyeOffIcon } from '@icons';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const auth = getAuth(app);

  const handleLogin = async () => {
    setLoading(true);
    try {
      // # 1 - User login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User logged in: ', userCredential.user.accessToken);
      const user = userCredential.user;

      // # 2 - Force token refresh to get updated custom claims
      await user.getIdToken(true);

      // # 3 - Get custom claims (userType) from the token
      const tokenResult = await user.getIdTokenResult();
      console.log('Token Claims: ', tokenResult.claims)

      const userType = tokenResult.claims.userType;

      if (!userType) {
        console.error('User type is undefined')
        throw new Error('Encontramos un problema con tu cuenta. Contacta a soporte.');
      }

      // # 4 - Redirect based on user type
      console.log('Logged in userType: ', userType);

      if (userType === 'sucursal') {
        router.push('/sucursal'); // MUST MATCH ENTRY IN SUCURSAL SERVICE
      } else if (userType === 'supervisor') {
        router.push('/supervisor'); // MUST MATCH ENTRY IN SUPERVISOR SERVICE
      } else {
        throw new Error('Unknown user type. Please contact support.')
      }
    } catch (err) {
      setError(err.message || 'Correo o contraseña incorrectos.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleMouseDown = () => {
    setShowPassword(true);
  };

  const handleMouseUp = () => {
    setShowPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await handleLogin();
  };

  return (
    <div className='flex flex-col justify-center items-center bg-white rounded-[15px] border border-qt_mid py-8 px-14 max-w-md mx-auto'>
      <div className='w-full'>
        <H1 className='text-center mb-4'>Acceso a la plataforma</H1>
        <P className='text-center text-xl mb-6'>Ingresa aquí tus credenciales para tener acceso a tu cuenta.</P>
        <form onSubmit={handleSubmit} className='w-full mb-8'>
          <label className='block mb-1 text-sm font-bold text-gray-700'>Correo electrónico *</label>
          <Input
            value={email}
            onChange={handleEmailChange}
            placeholder='Correo electrónico'
            className='w-full rounded-sm mb-4'
            aria-label='Correo electrónico'
          />
          <label className='block mb-1 text-sm font-bold text-gray-700'>Contraseña *</label>
          <div className='relative mb-8'>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder='***********'
              className='w-full rounded-sm'
              aria-label='Contraseña'
            />
            <span 
              className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchEnd={handleMouseUp}
            >
              {showPassword ? <EyeOffIcon className='h-5 w-5 text-qt_dark'/> : <EyeIcon className='h-5 w-5 text-qt_dark'/>}
            </span>
          </div>
          {error && <P className='text-red-600 mb-4 text-center'>{error}</P>}
          <Button
            className='w-full mb-4 bg-blue-600 text-white py-1 px-4 rounded-md text-lg'
            onClick={handleLogin}
            disabled={loading}
            >
            {loading ? '...' : 'Ingresar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
