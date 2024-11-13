'use client';

import React, { useEffect, useState } from 'react';
import { LoadingScreen, SessionEndedScreen, NotFoundScreen, Sidebar, Header, BottomNav } from '@components';
import { BellEmptyIcon, FinanceIcon, HomeIcon, LogoutIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon, TransactionIcon } from "@icons";
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { fetchSucursalData } from '@service/sucursal';
import app from '@service/firebaseConfig';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);  // Track the actual user state
  const [isValidUserType, setIsValidUserType] = useState(true); // Track if the user type is valid
  const [sucursalName, setSucursalName] = useState('');

  const router = useRouter();
  const auth = getAuth(app);

  // Toggle Sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Manage user authentication state and check user type
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);  // Store the user object
        const token = await currentUser.getIdTokenResult();
        const userType = token.claims.userType;

        if (userType !== 'sucursal') {
          setIsValidUserType(false); // If user type is incorrect, mark as invalid
        } else {
          setIsValidUserType(true);

          try {
            const sucursalData = await fetchSucursalData(currentUser.uid);
            setSucursalName(sucursalData.nombre);
          } catch (error) {
            console.error(`Error fetching sucursal data for UID ${currentUser.uid}: `, error);
          }
        }
      } else {
        setUser(null); // If no user is logged in, reset user to null
      }
      setLoading(false); // Stop loading after we check user type or session
    });

    return () => unsubscribe(); // Cleanup on component unmount
  }, [auth]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <SessionEndedScreen />;
  }

  if (!isValidUserType) {
    return <NotFoundScreen />;
  }

  // Define navigation items for BottomNav and add Logout
  const NavigationItems = [
    { icon: <HomeIcon />, name: 'Inicio', link: '/sucursal' },
    { icon: <TransactionIcon />, name: 'Operaciones', link: '/sucursal/operaciones' },
    { icon: <FinanceIcon />, name: 'Ingresos', link: '/sucursal/ingresos' },
    {
      icon: <LogoutIcon />,
      name: 'Logout',
      onClick: handleLogout // Attach the logout function here for mobile nav
    }
  ];

  return (
    <>
      <style jsx>{`
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* Internet Explorer 10+ */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }
      `}</style>
      <div className="flex h-screen flex-col md:flex-row">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          header="Quick Trade"
          items={NavigationItems.filter(item => item.name !== 'Logout')} // Remove logout for sidebar
          footer={{
            icon: <LogoutIcon />,
            text: 'Logout',
            onClick: handleLogout
          }}
          MenuIcon={<MenuIcon />}
        />

        {/* Main content container */}
        <div className="flex flex-1 flex-col overflow-auto hide-scrollbar">
          <Header
            name={sucursalName || '---'}
            role="Sucursal"
            SearchIcon={<SearchIcon className="text-qt_dark mr-5 h-6 w-6" />}
            BellIcon={<BellEmptyIcon className="w-7 h-7 text-qt_dark" />}
            MoonIcon={<MoonIcon className="text-qt_dark w-3 h-3" />}
            SunIcon={<SunIcon className="text-yellow-400 w-3 h-3" />}
          />

          {/* Main content */}
          <div className="flex-1 max-w-full overflow-auto m-0 p-0 hide-scrollbar">
            {children}
          </div>
        </div>

        {/* Bottom Navigation - Visible only on mobile */}
        <BottomNav items={NavigationItems} />
      </div>
    </>
  );
}