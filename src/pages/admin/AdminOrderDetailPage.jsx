import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getOrderById, updateOrderStatus } from '../../api/orderService';
import { formatCurrency } from '../../utils/formatCurrency';

const statusOptions = [
  { value: 'pending', label: 'Chờ xác nhận' },
  { value: 'processing', label: 'Đang xử lý' },
  { value: 'shipping', label: 'Đang giao' },
  { value: 'delivered', label: 'Đã giao' },
  { value: 'cancelled', label: 'Đã hủy' },
];

const badgeClasses = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipping: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const { userInfo } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);
  const [note, setNote] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('pending');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id, userInfo.token);
      setOrder(data);
      setSelectedStatus(data.orderStatus || 'pending');
    } catch (err) {
      setError('Không thể tải chi tiết đơn hàng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo?.token) {
      fetchOrder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, userInfo?.token]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    try {
      const updatedOrder = await updateOrderStatus(id, selectedStatus, userInfo.token, note);
      setOrder(updatedOrder);
      setNote('');
    } catch (err) {
      setError('Cập nhật trạng thái thất bại.');
    } finally {
      setUpdating(false);
    }
  };

  const latestStatus = useMemo(
    () => statusOptions.find((s) => s.value === order?.orderStatus),
    [order]
  );

  if (loading) return <p>Đang tải chi tiết đơn hàng...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return null;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chi tiết đơn hàng</h1>
          <p className="text-gray-500">Mã đơn: {order._id}</p>
        </div>
        <Link
          to="/admin/orders"
          className="text-sm px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
        >
          ← Quay lại danh sách
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Trạng thái hiện tại</p>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                badgeClasses[order.orderStatus] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {latestStatus?.label || 'Không xác định'}
            </span>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Cập nhật trạng thái</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              disabled={updating}
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <textarea
              placeholder="Ghi chú (ví dụ: Đã gọi xác nhận với khách...)"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
            <button
              type="button"
              onClick={handleStatusUpdate}
              disabled={updating}
              className="w-full bg-primary text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition disabled:opacity-70"
            >
              {updating ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
            </button>
            <p className="text-xs text-gray-500">
              Mỗi lần thay đổi trạng thái sẽ được lưu lại trong lịch sử theo dõi.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Thông tin giao hàng</h2>
          <div className="text-sm text-gray-600 space-y-2">
            <p><span className="font-medium">Khách hàng:</span> {order.shippingAddress.fullName}</p>
            <p><span className="font-medium">Email:</span> {order.shippingAddress.email}</p>
            <p><span className="font-medium">Số điện thoại:</span> {order.shippingAddress.phone}</p>
            <p><span className="font-medium">Địa chỉ:</span> {order.shippingAddress.address}</p>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-medium">Ngày đặt:</span> {new Date(order.createdAt).toLocaleString('vi-VN')}</p>
            <p><span className="font-medium">Giao lúc:</span> {order.deliveredAt ? new Date(order.deliveredAt).toLocaleString('vi-VN') : 'Chưa giao'}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">Thanh toán</h2>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(order.totalPrice)}</p>
          <p className="text-sm text-gray-500">
            {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
          </p>
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-700">Theo dõi trạng thái</h3>
            <div className="mt-3 space-y-3 max-h-48 overflow-y-auto pr-2">
              {order.statusHistory?.length ? (
                order.statusHistory
                  .slice()
                  .reverse()
                  .map((item, idx) => (
                    <div key={idx} className="text-sm text-gray-600 border-l-2 border-gray-200 pl-3">
                      <p className="font-medium">
                        {statusOptions.find((s) => s.value === item.status)?.label || item.status}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(item.updatedAt).toLocaleString('vi-VN')}
                      </p>
                      {item.note && <p className="text-xs text-gray-500 mt-1">{item.note}</p>}
                    </div>
                  ))
              ) : (
                <p className="text-sm text-gray-500">Chưa có lịch sử cập nhật.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Sản phẩm trong đơn</h2>
        <div className="divide-y divide-gray-100">
          {order.orderItems.map((item) => (
            <div key={item.product} className="py-4 flex items-center gap-4">
              <img src={item.imageUrl} alt={item.name} className="w-16 h-20 object-cover rounded" />
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
              </div>
              <p className="font-semibold text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetailPage;

