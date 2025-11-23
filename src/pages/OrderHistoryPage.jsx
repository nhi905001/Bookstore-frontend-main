import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders } from '../api/orderService';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import GoBackButton from '../components/GoBackButton';

const statusMap = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  processing: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-800' },
  shipping: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userInfo) {
        setError('Vui lòng đăng nhập để xem lịch sử đơn hàng.');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await getMyOrders(userInfo.token);
        setOrders(data);
      } catch (err) {
        setError('Không thể tải lịch sử đơn hàng.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  if (loading) {
    return <div className="container mx-auto text-center py-12">Đang tải lịch sử đơn hàng...</div>;
  }

  if (error) {
    return <div className="container mx-auto text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-8 md:px-20">
        <GoBackButton />
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Lịch Sử Đơn Hàng</h1>
        {orders.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>Bạn chưa có đơn hàng nào.</p>
            <Link to="/" className="text-primary hover:underline mt-4 inline-block">Bắt đầu mua sắm</Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-white p-6 rounded-lg shadow-md space-y-5">
                <div className="flex flex-wrap justify-between items-start gap-4 border-b pb-4">
                  <div>
                    <p className="font-semibold text-gray-800">
                      Mã đơn hàng:{' '}
                      <span className="font-normal text-gray-600">{order._id}</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      Ngày đặt: {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </p>
                    <p className="text-sm text-gray-500">
                      Địa chỉ: {order.shippingAddress?.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      Liên hệ: {order.shippingAddress?.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      Tổng cộng: {formatCurrency(order.totalPrice)}
                    </p>
                    <div className="mt-2">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          statusMap[order.orderStatus || 'pending']?.color || 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {statusMap[order.orderStatus || 'pending']?.label || 'Không xác định'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  {order.orderItems.map((item) => (
                    <div key={item.product} className="flex items-center space-x-4">
                      <img src={item.imageUrl} alt={item.name} className="w-16 h-20 object-cover rounded" />
                      <div className="flex-1">
                        <p className="font-semibold text-gray-700">{item.name}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistoryPage;
