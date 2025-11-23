import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProducts, deleteProduct } from '../../api/productService';
import { Link, useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';
import { formatCurrency } from '../../utils/formatCurrency';

const AdminProductListPage = () => {
  const { pageNumber = 1 } = useParams();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data } = await getProducts(pageNumber);
      setProducts(data.products);
      setPage(data.page);
      setPages(data.pages);
    } catch (err) {
      setError('Không thể tải danh sách sản phẩm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [pageNumber]);

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        await deleteProduct(id, userInfo.token);
        fetchProducts(); // Refresh the list
      } catch (err) {
        setError('Xóa sản phẩm thất bại.');
      }
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="flex flex-col min-h-full gap-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 uppercase tracking-[0.2em]">Bảng dữ liệu</p>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Sản phẩm</h1>
        </div>
        <Link
          to="/admin/products/create"
          className="bg-green-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-green-600 transition"
        >
          Thêm Sản phẩm
        </Link>
      </div>
      <div className="bg-white shadow-lg rounded-2xl border border-gray-100 flex-1 min-h-[600px] flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Danh sách sản phẩm</h2>
            <p className="text-sm text-gray-500">Quản lý và cập nhật kho sách của bạn</p>
          </div>
          <span className="text-sm text-gray-500">
            Tổng cộng <strong className="text-gray-900">{products.length}</strong> sản phẩm
          </span>
        </div>
        <div className="overflow-x-auto flex-1">
        <table className="min-w-full h-full divide-y divide-gray-200 rounded-b-2xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tồn kho</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Danh mục</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nhãn</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 align-top">
            {products.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(product.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {product.featured && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">Nổi bật</span>
                  )}
                  {product.bestseller && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold">Bán chạy</span>
                  )}
                  {!product.featured && !product.bestseller && <span className="text-gray-400 text-xs">—</span>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link to={`/admin/products/${product._id}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-4">Sửa</Link>
                  <button onClick={() => deleteHandler(product._id)} className="text-red-600 hover:text-red-900">Xóa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>
      <div className="pt-4">
        <Paginate pages={pages} page={page} isAdmin={true} basePath="/admin/products" />
      </div>
    </div>
  );
};

export default AdminProductListPage;
