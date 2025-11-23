import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/orderService';
import { formatCurrency } from '../utils/formatCurrency';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ name: '', address: '', email: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    }
  }, [userInfo, navigate]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const orderData = {
      orderItems: cartItems,
      shippingAddress: {
        fullName: formData.name,
        address: formData.address,
        email: formData.email,
        phone: formData.phone,
      },
      totalPrice: total,
    };

    try {
      await createOrder(orderData, userInfo.token);
      clearCart();
      setIsOrderPlaced(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Không thể đặt hàng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  if (isOrderPlaced) {
    return (
      <div className="container mx-auto px-8 md:px-20 py-12 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Cảm ơn bạn!</h1>
        <p className="text-lg text-gray-600 mb-8">Đơn hàng của bạn đã được đặt thành công.</p>
        <button 
          onClick={() => navigate('/my-account/orders')}
          className="bg-gray-800 text-white font-bold py-3 px-8 rounded-md hover:bg-gray-900 transition-colors duration-300"
        >
          Xem Lịch Sử Đơn Hàng
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-8 md:px-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Thanh Toán</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Thông tin giao hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{error}</div>}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                <input type="text" id="name" name="name" required onChange={handleChange} value={formData.name} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-gray-800 focus:border-gray-800" />
              </div>
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                <input type="text" id="address" name="address" required onChange={handleChange} value={formData.address} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-gray-800 focus:border-gray-800" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" id="email" name="email" required onChange={handleChange} value={formData.email} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-gray-800 focus:border-gray-800" />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                <input type="tel" id="phone" name="phone" required onChange={handleChange} value={formData.phone} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-gray-800 focus:border-gray-800" />
              </div>
              <button type="submit" disabled={loading || cartItems.length === 0} className="w-full bg-gray-800 text-white font-bold py-3 rounded-md hover:bg-gray-900 transition-colors duration-300 disabled:bg-gray-400">
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </form>
          </div>
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Tóm tắt đơn hàng</h2>
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between items-center">
                  <span className="text-gray-600">{item.name} (x{item.quantity})</span>
                  <span className="font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
              <div className="border-t pt-4 mt-4 font-bold text-xl flex justify-between text-gray-900">
                <span>Tổng cộng</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
