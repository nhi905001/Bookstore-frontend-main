import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRevenueSummary } from '../../api/orderService';
import RevenueChart from '../../components/RevenueChart';
import { formatCurrency } from '../../utils/formatCurrency';

const AdminDashboardPage = () => {
  const { userInfo } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!userInfo?.token) return;

    const fetchSummary = async () => {
      try {
        setLoading(true);
        const data = await getRevenueSummary(userInfo.token, 6);
        setStats(data);
      } catch (err) {
        setError('Không thể tải dữ liệu tổng quan. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [userInfo]);

  const monthlyMetrics = useMemo(() => {
    if (!stats?.monthlyRevenue?.length) return { latest: null, previous: null };
    const latest = stats.monthlyRevenue[stats.monthlyRevenue.length - 1];
    const previous = stats.monthlyRevenue[stats.monthlyRevenue.length - 2] || null;
    return { latest, previous };
  }, [stats]);

  const getTrendLabel = (current, previous) => {
    if (!previous || previous.revenue === 0) return '—';
    const diff = ((current.revenue - previous.revenue) / previous.revenue) * 100;
    const rounded = diff.toFixed(1);
    return `${diff >= 0 ? '+' : ''}${rounded}% so với tháng trước`;
  };

  if (loading) {
    return <p>Đang tải dữ liệu tổng quan...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!stats) return null;

  const infoCards = [
    {
      label: 'Tổng doanh thu',
      value: formatCurrency(stats.totalRevenue),
      helper: monthlyMetrics.latest
        ? `Tháng ${monthlyMetrics.latest.label}: ${formatCurrency(monthlyMetrics.latest.revenue)}`
        : 'Chưa có dữ liệu tháng',
    },
    {
      label: 'Tổng số đơn',
      value: stats.totalOrders.toLocaleString('vi-VN'),
      helper: monthlyMetrics.latest ? `${monthlyMetrics.latest.orders} đơn trong tháng gần nhất` : '',
    },
    {
      label: 'Số lượng sản phẩm',
      value: stats.totalProducts.toLocaleString('vi-VN'),
      helper: 'Các sản phẩm đang được bán',
    },
    {
      label: 'Người dùng',
      value: stats.totalUsers.toLocaleString('vi-VN'),
      helper: 'Bao gồm khách hàng & quản trị viên',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-500">Theo dõi hiệu suất kinh doanh trong 6 tháng gần nhất.</p>
        </div>
        {monthlyMetrics.latest && (
          <div className="bg-white rounded-lg shadow px-6 py-4">
            <p className="text-sm text-gray-500">Diễn biến tháng {monthlyMetrics.latest.label}</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(monthlyMetrics.latest.revenue)}
            </p>
            <p className="text-sm text-green-600">
              {getTrendLabel(monthlyMetrics.latest, monthlyMetrics.previous)}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {infoCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{card.value}</p>
            {card.helper && <p className="text-xs text-gray-500 mt-1">{card.helper}</p>}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Biểu đồ doanh thu</h2>
            <p className="text-sm text-gray-500">Doanh thu và số lượng đơn hàng theo tháng</p>
          </div>
        </div>
        <RevenueChart data={stats.monthlyRevenue} />
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Chi tiết theo tháng</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tháng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.monthlyRevenue.map((item) => (
                <tr key={item.label}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.label}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(item.revenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.orders} đơn</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

