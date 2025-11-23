import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getUsers, deleteUser } from '../../api/userService';
import { useParams } from 'react-router-dom';
import Paginate from '../../components/Paginate';

const AdminUserListPage = () => {
  const { pageNumber = 1 } = useParams();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userInfo } = useAuth();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const payload = await getUsers(userInfo.token, pageNumber);
      setUsers(payload.users);
      setPage(payload.page);
      setPages(payload.pages);
      setError('');
    } catch (err) {
      console.error('Failed to fetch users', err);
      setError('Không thể tải danh sách người dùng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [pageNumber, userInfo?.token]);

  const deleteHandler = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await deleteUser(id, userInfo.token);
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError('Xóa người dùng thất bại.');
      }
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Quản lý Người dùng</h1>
      <div className="bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quản trị viên</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user._id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {user.isAdmin ? (
                    <span className="text-green-600 font-semibold">Có</span>
                  ) : (
                    <span className="text-red-600">Không</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {userInfo._id !== user._id && (
                    <button onClick={() => deleteHandler(user._id)} className="text-red-600 hover:text-red-900">Xóa</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginate pages={pages} page={page} isAdmin={true} basePath="/admin/users" />
    </div>
  );
};

export default AdminUserListPage;
