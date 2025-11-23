import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout'; // Import Admin Layout
import AdminRoute from './components/AdminRoute'; // Import Admin Route

// Public Pages
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SearchPage from './pages/SearchPage';
import OrderHistoryPage from './pages/OrderHistoryPage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminRevenuePage from './pages/admin/AdminRevenuePage';
import AdminProductListPage from './pages/admin/AdminProductListPage';
import AdminProductEditPage from './pages/admin/AdminProductEditPage';
import AdminProductCreatePage from './pages/admin/AdminProductCreatePage';
import AdminOrderListPage from './pages/admin/AdminOrderListPage';
import AdminOrderDetailPage from './pages/admin/AdminOrderDetailPage';
import AdminUserListPage from './pages/admin/AdminUserListPage';

function App() {
  return (
    <>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/page/:pageNumber" element={<HomePage />} />
        <Route path="/category/:category" element={<HomePage />} />
        <Route path="/category/:category/page/:pageNumber" element={<HomePage />} />
        <Route path="cart" element={<CartPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="product/:id" element={<ProductDetailPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="my-account/orders" element={<OrderHistoryPage />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="revenue" element={<AdminRevenuePage />} />
          <Route path="products" element={<AdminProductListPage />} />
          <Route path="products/page/:pageNumber" element={<AdminProductListPage />} />
          <Route path="products/:id/edit" element={<AdminProductEditPage />} />
          <Route path="products/create" element={<AdminProductCreatePage />} />
          <Route path="orders" element={<AdminOrderListPage />} />
          <Route path="orders/page/:pageNumber" element={<AdminOrderListPage />} />
          <Route path="orders/:id" element={<AdminOrderDetailPage />} />
          <Route path="users" element={<AdminUserListPage />} />
          <Route path="users/page/:pageNumber" element={<AdminUserListPage />} />
        </Route>
      </Route>
    </Routes>
    <Toaster position="top-right" />
    </>
  );
}

export default App;
