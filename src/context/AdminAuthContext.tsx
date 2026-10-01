import React, { createContext, useContext, useState, useEffect } from 'react';

interface AdminAuthContextType {
  isAdminLoggedIn: boolean;
  loginAdmin: (password: string) => { success: boolean; message?: string };
  logoutAdmin: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_STORAGE_KEY = 'aurelia_admin_auth_session';
const MASTER_PASSWORD = 'vageesha@2026';

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
      return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      if (isAdminLoggedIn) {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      } else {
        sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Storage error', e);
    }
  }, [isAdminLoggedIn]);

  const loginAdmin = (password: string) => {
    if (password.trim() === MASTER_PASSWORD) {
      setIsAdminLoggedIn(true);
      return { success: true };
    }
    return { success: false, message: 'Invalid master passcode. Access denied.' };
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ isAdminLoggedIn, loginAdmin, logoutAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
