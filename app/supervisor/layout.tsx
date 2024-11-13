'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar, Header, BottomNav, LoadingScreen, SessionEndedScreen, NotFoundScreen } from '@components'; 
import { BellEmptyIcon, BusinessIcon, CheckIcon, FinanceIcon, HomeIcon, LogoutIcon, MenuIcon, MoonIcon, NoIcon, SearchIcon, SunIcon, TransactionIcon } from "@icons";
import { getAuth, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import app from '@service/firebaseConfig';
import { fetchSupervisorData } from '@service/supervisor';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); // Initially true to display loading
  const [user, setUser] = useState<User | null>(null);
  const [isValidUserType, setIsValidUserType] = useState(true);
  const [supervisorName, setSupervisorName] = useState('');

  const router = useRouter();
  const auth = getAuth(app);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          console.log('% ', currentUser);
          const token= await currentUser.getIdToken(true);
          const tokenResult = await currentUser.getIdTokenResult();
          const userType = tokenResult.claims.userType;
          
          setUser(currentUser);

          if (userType !== 'supervisor') {
            setIsValidUserType(false);
          } else {
            setIsValidUserType(true);
            const supervisorData = await fetchSupervisorData(currentUser.uid);
            setSupervisorName(supervisorData.nombre);
          }
        } catch (error) {
          console.error(`Error fetching supervisor data for UID ${currentUser.uid}: `, error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false); // Only set loading to false once the user state is checked
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <SessionEndedScreen />; // Route protection
  }

  if (!isValidUserType) {
    return <NotFoundScreen />; // Route protection
  }

  // Navigation items for BottomNav
  const NavigationItems = [
    { icon: <HomeIcon />, name: "Inicio", link: "/supervisor" },
    { icon: <CheckIcon />, name: "Autorizaciones", link: "/supervisor/autorizaciones" },
    { icon: <FinanceIcon />, name: "Ingresos/gastos", link: "/supervisor/ingresos" },
    { icon: <BusinessIcon />, name: "Sucursales", link: "/supervisor/sucursales" },
    {
      icon: <LogoutIcon />,
      name: 'Logout',
      onClick: handleLogout
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
          items={NavigationItems.filter(item => item.name !== 'Logout')}
          footer={{ icon: <LogoutIcon />, text: 'Logout', onClick: handleLogout }}
          MenuIcon={<MenuIcon />}
        />

        {/* Main content container */}
        <div className="flex flex-1 flex-col overflow-auto hide-scrollbar">
          <Header 
            name={supervisorName || '---'}
            role="Supervisor"
            SearchIcon={<SearchIcon className="text-qt_dark mr-5 h-6 w-6" />}
            BellIcon={<BellEmptyIcon className="w-7 h-7 text-qt_dark" />}
            MoonIcon={<MoonIcon className="text-qt_dark w-3 h-3" />}
            SunIcon={<SunIcon className="text-yellow-400 w-3 h-3" />}
          />
          {/* Main content */}
          <div className="flex-1 max-w-full overflow-auto m-0 p-0 hide-scrollbar pb-16">
            {children}
          </div>
        </div>

        {/* Bottom Navigation - Visible only on mobile */}
        <BottomNav items={NavigationItems} />
      </div>
    </>
  );
}