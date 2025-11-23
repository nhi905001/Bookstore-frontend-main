import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getRevenueSummary } from '../../api/orderService';
import RevenueChart from '../../components/RevenueChart';
import { formatCurrency } from '../../utils/formatCurrency';

const MONTH_OPTIONS = [3, 6, 12];

const AdminRevenuePage = () => {
  const { userInfo } = useAuth();
  const [summary, setSummary] = useState(null);
  const [months, setMonths] = useState(6);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSummary = async (selectedMonths = months) => {
    if (!userInfo?.token) return;
    try {
      setLoading(true);
      const data = await getRevenueSummary(userInfo.token, selectedMonths);
      setSummary(data);
    } catch (err) {
      setError('Không thể tải dữ liệu doanh thu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSummary(months);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [months, userInfo?.token]);

  const aggregates = useMemo(() => {
    if (!summary?.monthlyRevenue) {
      return { total: 0, orders: 0, avgOrder: 0 };
    }
    const total = summary.monthlyRevenue.reduce((acc, curr) => acc + curr.revenue, 0);
    const orders = summary.monthlyRevenue.reduce((acc, curr) => acc + curr.orders, 0);
    return {
      total,
      orders,
      avgOrder: orders ? total / orders : 0,
    };
  }, [summary]);

  const handleChangeMonths = (event) => {
    const selected = Number(event.target.value);
    setMonths(selected);
  };

  if (loading) {
    return <p>Đang tải dữ liệu doanh thu...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!summary) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phân tích doanh thu</h1>
          <p className="text-gray-500">Theo dõi hiệu suất bán hàng trong {months} tháng gần nhất.</p>
        </div>
        <div className="flex items-center space-x-3">
          <label htmlFor="months" className="text-sm font-medium text-gray-600">
            Khoảng thời gian
          </label>
          <select
            id="months"
            value={months}
            onChange={handleChangeMonths}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {MONTH_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option} tháng gần nhất
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Doanh thu (khoảng đã chọn)</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(aggregates.total)}</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Số đơn (khoảng đã chọn)</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{aggregates.orders.toLocaleString('vi-VN')} đơn</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-5 border border-gray-100">
          <p className="text-sm text-gray-500">Giá trị trung bình / đơn</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{formatCurrency(aggregates.avgOrder)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Biểu đồ doanh thu & số đơn</h2>
            <p className="text-sm text-gray-500">Lượng đơn hàng sẽ được hiển thị cùng trên biểu đồ</p>
          </div>
        </div>
        <RevenueChart data={summary.monthlyRevenue} barColor="#1d4ed8" lineColor="#059669" />
      </div>

      <div className="bg-white rounded-2xl shadow">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Bảng dữ liệu chi tiết</h2>
          <span className="text-sm text-gray-500">{summary.monthlyRevenue.length} mục</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tháng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Số đơn</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doanh thu / đơn</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {summary.monthlyRevenue.map((item) => (
                <tr key={item.label}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.label}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatCurrency(item.revenue)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.orders} đơn</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {item.orders ? formatCurrency(item.revenue / item.orders) : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRevenuePage;

