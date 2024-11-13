'use client';

import React from 'react';
import Link from 'next/link';
import { IconButton } from '@components';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  header?: React.ReactNode;
  items?: { icon: React.ReactElement; name: string; link?: string }[];
  footer?: { icon: React.ReactElement; text: string; link?: string; onClick?: () => void };
  MenuIcon: React.ReactElement;
  className?: string;
}

export default function Sidebar({ isOpen, toggleSidebar, header, items, footer, MenuIcon, className }: SidebarProps) {
  const router = useRouter();
  return (
    <>
      {/* Sidebar - Visible only on desktop */}
      <div
        role='complementary'
        className={`hidden md:flex flex-col bg-white transition-all duration-300 ease-in-out z-50 border ${
          isOpen ? 'w-64' : 'w-16'
        } ${className}`}
        style={{ height: '100vh' }} // Full height for desktop sidebar
      >
        {/* Header and Toggle Button */}
        <div className="flex items-center justify-between p-4">
          {isOpen && ( // Only show the header when the sidebar is expanded
            <div className="flex-1 transition-opacity duration-300 opacity-100">
              {header && <h1 className="text-left text-2xl font-bold">{header}</h1>}
            </div>
          )}
          <IconButton
            icon={MenuIcon}
            onClick={toggleSidebar}
            className="focus:outline-none transition-all duration-300 flex items-center justify-center hover:bg-qt_highlight hover:text-qt_blue"
            style={{ width: '1.5rem', height: '1.5rem' }}
            aria-label={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
          />
        </div>

        {/* Sidebar Items */}
        {items && (
          <ul className="flex-1 overflow-y-auto overflow-x-hidden">
            {items.map((item, index) => (
              <li key={index} className="flex items-center py-2 px-4 cursor-pointer">
                <Link
                  href={item.link || '#'}
                  className={`flex items-center p-2 rounded-lg text-qt_dark hover:bg-qt_highlight hover:text-qt_blue transition-all duration-300 ${
                    isOpen ? 'justify-start' : 'justify-center'
                  } w-full`}
                >
                  <span className="flex-shrink-0">{React.cloneElement(item.icon, { className: 'h-6 w-6' })}</span>
                  {isOpen && <span className="ml-2">{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        {footer && (
          <div className="flex items-center p-4 cursor-pointer">
            <div
              onClick={() => {
                if (footer.onClick) {
                  footer.onClick(); // Call the logout function
                } else if (footer.link) {
                  router.push(footer.link); // Navigate to the link if provided
                }
              }}
              className={`flex items-center p-2 rounded-lg text-qt_dark hover:bg-qt_highlight hover:text-qt_blue transition-all duration-300 ${
                isOpen ? 'justify-start' : 'justify-center'
              } w-full`}
            >
              <span className="flex-shrink-0">{React.cloneElement(footer.icon, { className: 'h-6 w-6' })}</span>
              {isOpen && <span className="ml-2">{footer.text}</span>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
