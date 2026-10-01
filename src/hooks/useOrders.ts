import { useState, useEffect, useCallback } from 'react';
import { Order } from '../types';
import { getStoredOrders, updateOrderStatus, deleteOrder, saveNewOrder } from '../services/orderStorage';
import { apiService } from '../services/api';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>(() => getStoredOrders());

  const refreshOrders = useCallback(async () => {
    try {
      const liveOrders = await apiService.getOrders();
      if (Array.isArray(liveOrders) && liveOrders.length > 0) {
        setOrders(liveOrders);
        return;
      }
    } catch (err) {
      console.warn('Backend orders fetch fallback:', err);
    }
    setOrders(getStoredOrders());
  }, []);

  useEffect(() => {
    // Initial fetch from backend
    refreshOrders();

    // Listen for custom app order updates
    const handleOrderUpdate = (e: any) => {
      if (e.detail) {
        setOrders(e.detail);
      } else {
        refreshOrders();
      }
    };

    // Listen for cross-tab storage events
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'aurelia_customer_orders') {
        refreshOrders();
      }
    };

    window.addEventListener('aurelia_orders_updated', handleOrderUpdate);
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('aurelia_orders_updated', handleOrderUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshOrders]);

  const changeStatus = async (orderId: string, newStatus: string) => {
    // Optimistic local update
    const updated = updateOrderStatus(orderId, newStatus);
    setOrders(updated);
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
    } catch (err) {
      console.warn('Failed to update status on server:', err);
    }
  };

  const removeOrder = async (orderId: string) => {
    const updated = deleteOrder(orderId);
    setOrders(updated);
    try {
      await apiService.deleteOrder(orderId);
    } catch (err) {
      console.warn('Failed to delete order on server:', err);
    }
  };

  const createOrder = (order: Order) => {
    const updated = saveNewOrder(order);
    setOrders(updated);
  };

  return {
    orders,
    refreshOrders,
    changeStatus,
    removeOrder,
    createOrder,
  };
};
