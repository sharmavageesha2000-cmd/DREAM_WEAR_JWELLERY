import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { Layout } from './components/layout/Layout';

// Customer Pages
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Collections } from './pages/Collections';
import { SearchPage } from './pages/Search';
import { ProductDetail } from './pages/ProductDetail';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { Wishlist } from './pages/Wishlist';
import { Account } from './pages/Account';
import { Login } from './pages/Login';
import { AboutUs } from './pages/AboutUs';
import { ContactUs } from './pages/ContactUs';
import { FAQ } from './pages/FAQ';
import { ShippingDelivery } from './pages/ShippingDelivery';
import { ReturnsRefunds } from './pages/ReturnsRefunds';
import { PrivacyTerms } from './pages/PrivacyTerms';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProducts } from './pages/admin/AdminProducts';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminCustomers } from './pages/admin/AdminCustomers';
import { AdminCoupons } from './pages/admin/AdminCoupons';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';

const AdminEntryRoute: React.FC = () => {
  const { isAdminLoggedIn } = useAdminAuth();
  return isAdminLoggedIn ? <Navigate to="/admin/dashboard" replace /> : <AdminLogin />;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <ToastProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Routes>
                  {/* Customer Store Routes wrapped in Main Layout */}
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="shop" element={<Shop />} />
                    <Route path="collections/:collectionSlug" element={<Collections />} />
                    <Route path="search" element={<SearchPage />} />
                    <Route path="product/:id" element={<ProductDetail />} />
                    <Route path="cart" element={<Cart />} />
                    <Route path="checkout" element={<Checkout />} />
                    <Route path="order-confirmation/:orderId" element={<OrderConfirmation />} />
                    <Route path="wishlist" element={<Wishlist />} />
                    <Route path="account" element={<Account />} />
                    <Route path="orders" element={<Account />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Login />} />
                    <Route path="about" element={<AboutUs />} />
                    <Route path="contact" element={<ContactUs />} />
                    <Route path="faq" element={<FAQ />} />
                    <Route path="shipping-delivery" element={<ShippingDelivery />} />
                    <Route path="returns-refunds" element={<ReturnsRefunds />} />
                    <Route path="privacy-policy" element={<PrivacyTerms />} />
                    <Route path="terms" element={<PrivacyTerms />} />
                  </Route>

                  {/* Admin Portal Authentication & Management Routes */}
                  <Route path="/admin" element={<AdminEntryRoute />} />
                  <Route path="/admin/login" element={<AdminEntryRoute />} />
                  <Route
                    path="/admin/dashboard"
                    element={
                      <AdminLayout>
                        <AdminDashboard />
                      </AdminLayout>
                    }
                  />
                  <Route
                    path="/admin/products"
                    element={
                      <AdminLayout>
                        <AdminProducts />
                      </AdminLayout>
                    }
                  />
                  <Route
                    path="/admin/orders"
                    element={
                      <AdminLayout>
                        <AdminOrders />
                      </AdminLayout>
                    }
                  />
                  <Route
                    path="/admin/customers"
                    element={
                      <AdminLayout>
                        <AdminCustomers />
                      </AdminLayout>
                    }
                  />
                  <Route
                    path="/admin/coupons"
                    element={
                      <AdminLayout>
                        <AdminCoupons />
                      </AdminLayout>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <AdminLayout>
                        <AdminAnalytics />
                      </AdminLayout>
                    }
                  />

                  {/* Catch-all fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ToastProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  );
};

export default App;
