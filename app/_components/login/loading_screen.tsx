'use client';

import React from 'react';
import { H1 } from '@components';

export default function LoadingScreen() {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <H1 className='mb-8'>QuickTrade</H1>
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}
