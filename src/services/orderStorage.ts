import { Order } from '../types';
import { products } from '../data/products';

export const ORDERS_STORAGE_KEY = 'aurelia_customer_orders';
export const CUSTOMERS_STORAGE_KEY = 'aurelia_admin_customers';

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'AUR-892147',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'Processing',
    items: [
      {
        productId: 'aur-n-01',
        productName: 'Minimal Baroque Pearl Pendant Necklace',
        image: products[0]?.images[0] || '/images/products/aur_n_01_1.jpg',
        price: 1899,
        quantity: 1,
        finish: '18K Yellow Gold',
        size: '40cm + 5cm extender',
      },
      {
        productId: 'aur-e-01',
        productName: 'Chubby Bold Huggie Hoops',
        image: products[8]?.images[0] || '/images/products/aur_e_01_1.jpg',
        price: 1499,
        quantity: 1,
        finish: '18K Yellow Gold',
      },
    ],
    shippingAddress: {
      id: 'a1',
      name: 'Ananya Roy',
      phone: '+91 98111 22334',
      street: '14, Golf Links, Lodhi Road',
      city: 'New Delhi',
      state: 'Delhi',
      postalCode: '110003',
      country: 'India',
    },
    shippingMethod: 'standard',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    subtotal: 3398,
    discount: 340,
    couponCode: 'WELCOME10',
    shippingFee: 0,
    total: 3058,
    trackingNumber: 'BLUEDART-89472190',
    estimatedDelivery: '3 Days',
  },
  {
    id: 'ord-102',
    orderNumber: 'AUR-641092',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    status: 'Shipped',
    items: [
      {
        productId: 'aur-n-02',
        productName: 'Liquid Gold Herringbone Flat Chain',
        image: products[1]?.images[0] || '/images/products/aur_n_02_1.jpg',
        price: 2199,
        quantity: 1,
        finish: '18K Yellow Gold',
        size: '38cm + 5cm extender',
      },
    ],
    shippingAddress: {
      id: 'a2',
      name: 'Kavya Pillai',
      phone: '+91 99444 55667',
      street: 'Indiranagar 100ft Road',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'India',
    },
    shippingMethod: 'express',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    subtotal: 2199,
    discount: 0,
    shippingFee: 199,
    total: 2398,
    trackingNumber: 'DELHIVERY-77401923',
    estimatedDelivery: 'Tomorrow',
  },
  {
    id: 'ord-103',
    orderNumber: 'AUR-510984',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    status: 'Delivered',
    items: [
      {
        productId: 'aur-r-01',
        productName: 'Croissant Dome Signet Ring',
        image: products[15]?.images[0] || '/images/products/aur_r_01_1.jpg',
        price: 1499,
        quantity: 1,
        finish: '18K Yellow Gold',
        size: 'US 7',
      },
    ],
    shippingAddress: {
      id: 'a3',
      name: 'Vageesha Sharma',
      phone: '+91 98765 43210',
      street: 'Flat 402, Highgrove Apartments, Pali Hill',
      city: 'Mumbai',
      state: 'Maharashtra',
      postalCode: '400050',
      country: 'India',
    },
    shippingMethod: 'standard',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    subtotal: 1499,
    discount: 150,
    couponCode: 'WELCOME10',
    shippingFee: 0,
    total: 1349,
    trackingNumber: 'BLUEDART-55201984',
    estimatedDelivery: 'Delivered on Friday',
  },
];

/**
 * Get all stored orders from localStorage with fallback initialization
 */
export const getStoredOrders = (): Order[] => {
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse orders from localStorage', err);
  }
  // Initialize with sample orders if none exist
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(INITIAL_ORDERS));
  return INITIAL_ORDERS;
};

/**
 * Save a newly placed customer order
 */
export const saveNewOrder = (order: Order): Order[] => {
  const currentOrders = getStoredOrders();
  // Check if already exists
  const existingIdx = currentOrders.findIndex(
    (o) => o.id === order.id || o.orderNumber === order.orderNumber
  );
  let updated: Order[];
  if (existingIdx >= 0) {
    updated = currentOrders.map((o, idx) => (idx === existingIdx ? order : o));
  } else {
    updated = [order, ...currentOrders];
  }
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  
  // Also register/update customer directory
  syncCustomerFromOrder(order);

  // Notify all listeners
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aurelia_orders_updated', { detail: updated }));
  }
  return updated;
};

/**
 * Update the fulfillment status of an order
 */
export const updateOrderStatus = (orderId: string, newStatus: string): Order[] => {
  const currentOrders = getStoredOrders();
  const updated = currentOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aurelia_orders_updated', { detail: updated }));
  }
  return updated;
};

/**
 * Delete an order by ID
 */
export const deleteOrder = (orderId: string): Order[] => {
  const currentOrders = getStoredOrders();
  const updated = currentOrders.filter((o) => o.id !== orderId);
  localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updated));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('aurelia_orders_updated', { detail: updated }));
  }
  return updated;
};

/**
 * Sync customer stats from newly placed order
 */
export const syncCustomerFromOrder = (order: Order) => {
  try {
    const rawCust = localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    const customers = rawCust ? JSON.parse(rawCust) : [];
    const existing = customers.find(
      (c: any) =>
        c.name.toLowerCase() === order.shippingAddress.name.toLowerCase() ||
        c.phone === order.shippingAddress.phone
    );

    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += order.total;
      existing.hasWarranty = true;
    } else {
      customers.unshift({
        id: `usr-${Date.now()}`,
        name: order.shippingAddress.name,
        email: `${order.shippingAddress.name.toLowerCase().replace(/[^a-z0-9]+/g, '.')}@example.com`,
        phone: order.shippingAddress.phone,
        city: order.shippingAddress.city,
        totalOrders: 1,
        totalSpent: order.total,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        hasWarranty: true,
      });
    }
    localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch (err) {
    console.error('Failed to sync customer from order', err);
  }
};
