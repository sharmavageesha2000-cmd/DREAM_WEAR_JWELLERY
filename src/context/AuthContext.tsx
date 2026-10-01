import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Order, Address } from '../types';
import { getStoredOrders, saveNewOrder } from '../services/orderStorage';
import { apiService } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  isLoggedIn: boolean;
  orders: Order[];
  login: (email: string, name?: string, password?: string) => Promise<boolean>;
  register: (name: string, email: string, phone?: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => Address;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'aurelia_user_profile';

const DEFAULT_MOCK_USER: UserProfile = {
  id: 'usr-901',
  name: 'Vageesha Sharma',
  email: 'vageesha@example.com',
  phone: '+91 98765 43210',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  joinedDate: 'November 2023',
  savedAddresses: [
    {
      id: 'addr-1',
      name: 'Vageesha Sharma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Highgrove Apartments, Pali Hill',
      apartment: 'Near Costa Coffee',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
      isDefault: true,
    },
  ],
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_MOCK_USER;
    } catch {
      return DEFAULT_MOCK_USER;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());

  // Listen for order updates
  useEffect(() => {
    const handleOrderUpdate = (e: any) => {
      if (e.detail) {
        setOrders(e.detail);
      } else {
        setOrders(getStoredOrders());
      }
    };
    window.addEventListener('aurelia_orders_updated', handleOrderUpdate);
    return () => window.removeEventListener('aurelia_orders_updated', handleOrderUpdate);
  }, []);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save user', e);
    }
  }, [user]);

  const login = async (email: string, name?: string, password?: string): Promise<boolean> => {
    try {
      const userProfile = await apiService.loginUser(email, name, password);
      setUser(userProfile);
      return true;
    } catch (e) {
      console.warn('Backend login fallback:', e);
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name || email.split('@')[0] || 'Aurelia Member',
        email,
        phone: '+91 98765 43210',
        joinedDate: 'Today',
        savedAddresses: user?.savedAddresses || [],
      };
      setUser(newUser);
      return true;
    }
  };

  const register = async (name: string, email: string, phone?: string, password?: string): Promise<boolean> => {
    try {
      const userProfile = await apiService.registerUser(name, email, phone, password);
      setUser(userProfile);
      return true;
    } catch (e) {
      console.warn('Backend register fallback:', e);
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone: phone || '+91 98765 43210',
        joinedDate: 'Today',
        savedAddresses: [],
      };
      setUser(newUser);
      return true;
    }
  };


  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('aurelia_auth_token');
    } catch {
      // ignore
    }
  };

  const updateProfile = async (profile: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...profile } : null));
    try {
      await apiService.updateUserProfile(profile);
    } catch (err) {
      console.warn('Failed to sync profile update with backend:', err);
    }
  };

  const addAddress = (address: Omit<Address, 'id'>): Address => {
    const newAddress: Address = {
      ...address,
      id: `addr-${Date.now()}`,
    };
    setUser((prev) => {
      if (!prev) return null;
      const isFirst = prev.savedAddresses.length === 0;
      return {
        ...prev,
        savedAddresses: [
          ...prev.savedAddresses.map((a) => (newAddress.isDefault ? { ...a, isDefault: false } : a)),
          { ...newAddress, isDefault: newAddress.isDefault || isFirst },
        ],
      };
    });
    // Async background sync to PostgreSQL
    apiService.addAddress(address).catch((err) => console.warn('Address sync error:', err));
    return newAddress;
  };

  const deleteAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        savedAddresses: prev.savedAddresses.filter((a) => a.id !== id),
      };
    });
    apiService.deleteAddress(id).catch((err) => console.warn('Delete address sync error:', err));
  };

  const setDefaultAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        savedAddresses: prev.savedAddresses.map((a) => ({
          ...a,
          isDefault: a.id === id,
        })),
      };
    });
    apiService.setDefaultAddress(id).catch((err) => console.warn('Default address sync error:', err));
  };

  const addOrder = (order: Order) => {
    const updated = saveNewOrder(order);
    setOrders(updated);
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        orders,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        deleteAddress,
        setDefaultAddress,
        addOrder,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
