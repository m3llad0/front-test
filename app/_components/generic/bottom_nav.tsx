'use client';

import React from 'react';
import Link from 'next/link';

interface BottomNavProps {
  items: { icon: React.ReactElement; name: string; link?: string; onClick?: () => void }[];
}

export default function BottomNav({ items }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around px-2 pb-3 pt-4">
        {/* Render Nav Items dynamically */}
        {items.map((item, index) => (
          item.link ? (
            <Link
              key={index}
              href={item.link}
              className="flex flex-col items-center justify-center text-qt_dark hover:text-qt_blue"
            >
              {React.cloneElement(item.icon, { className: 'h-6 w-6' })}
            </Link>
          ) : (
            <button
              key={index}
              onClick={item.onClick}
              className="flex flex-col items-center justify-center text-qt_dark hover:text-qt_blue"
            >
              {React.cloneElement(item.icon, { className: 'h-5 w-5' })}
            </button>
          )
        ))}
      </div>
    </div>
  );
}