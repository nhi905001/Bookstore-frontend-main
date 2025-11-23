import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Tổng quan', to: '/admin', end: true },
  { label: 'Doanh thu', to: '/admin/revenue' },
  { label: 'Quản lý Sản phẩm', to: '/admin/products' },
  { label: 'Quản lý Đơn hàng', to: '/admin/orders' },
  { label: 'Quản lý Người dùng', to: '/admin/users' },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout, userInfo } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
    `${isActive ? 'bg-white text-gray-900' : 'text-gray-300 hover:bg-gray-700 hover:text-white'} px-3 py-2 rounded-md text-sm font-medium transition`;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white p-6 flex flex-col sticky top-0 h-screen overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-wide">Bookstore Admin</h1>
          {userInfo && (
            <div className="mt-4 p-3 bg-white/10 rounded-lg">
              <p className="text-sm text-gray-300">Xin chào,</p>
              <p className="font-semibold truncate">{userInfo.name}</p>
            </div>
          )}
        </div>
        <nav className="flex flex-col space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClasses}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto pt-8">
          <button
            onClick={handleLogout}
            className="w-full bg-white/10 border border-white/20 text-sm px-4 py-2 rounded-xl font-medium hover:bg-white hover:text-gray-900 transition"
          >
            Đăng xuất
          </button>
        </div>
      </aside>
      <main className="flex-grow p-8 flex">
        <div className="flex-1 flex flex-col">
        <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

