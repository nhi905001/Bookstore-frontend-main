import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';
import { formatCurrency } from '../utils/formatCurrency';

const compactCurrency = (value) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}K`;
  return value;
};

const RevenueChart = ({ data = [], barColor = '#2563eb', lineColor = '#10b981' }) => {
  if (!data.length) {
    return <p className="text-sm text-gray-500">Chưa có dữ liệu doanh thu để hiển thị.</p>;
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="label" stroke="#6b7280" />
          <YAxis
            yAxisId="left"
            tickFormatter={compactCurrency}
            stroke={barColor}
            width={70}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            stroke={lineColor}
            allowDecimals={false}
            width={40}
          />
          <Tooltip
            formatter={(value, name) =>
              name === 'Doanh thu' ? formatCurrency(value) : `${value} đơn`
            }
            labelFormatter={(label) => `Tháng ${label}`}
          />
          <Legend />
          <Bar
            yAxisId="left"
            dataKey="revenue"
            name="Doanh thu"
            fill={barColor}
            radius={[6, 6, 0, 0]}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="orders"
            name="Số đơn"
            stroke={lineColor}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;

