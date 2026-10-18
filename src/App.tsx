/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout from './components/admin/AdminLayout';
import HomePage from './pages/HomePage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductManagement from './pages/admin/AdminProductManagement';
import OutfitPage from './pages/admin/OutfitPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import OrderManagementPage from './pages/admin/OrderManagementPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerLayout />}>
          <Route index element={<HomePage />} />
          <Route path="product/:id" element={<ProductDetailsPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="order-confirmation" element={<OrderConfirmationPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
          <Route path="order/:id" element={<OrderDetailsPage />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="login" element={<AdminLoginPage />} />
          <Route path="products" element={<AdminProductManagement />} />
          <Route path="outfits" element={<OutfitPage />} />
          <Route path="orders" element={<OrderManagementPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
