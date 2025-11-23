import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../utils/formatCurrency';
import GoBackButton from '../components/GoBackButton';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart } = useCart();

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-8 md:px-20 py-12 text-center">
        <div className="max-w-3xl mx-auto">
          <GoBackButton />
          <h1 className="text-4xl font-bold text-gray-800 mb-4 mt-4">Giỏ hàng của bạn đang trống</h1>
          <p className="text-gray-600 mb-8">Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.</p>
          <Link to="/" className="bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-blue-600 transition-colors duration-300">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-8 md:px-20">
        <GoBackButton />
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Giỏ Hàng</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="space-y-6">
            {cartItems.map(item => (
              <div key={item._id} className="flex flex-col md:flex-row justify-between items-center border-b pb-4">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                  <img src={item.imageUrl} alt={item.name} className="w-24 h-32 object-cover rounded-md" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
                    <p className="text-gray-500">Tác giả: {item.author}</p>
                    <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(item.price)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <input 
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                    className="w-20 text-center border rounded-md p-2"
                    min="1"
                  />
                  <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:text-red-700 font-semibold">Xóa</button>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-right">
            <h2 className="text-2xl font-bold text-gray-800">Tổng cộng: {formatCurrency(total)}</h2>
            <Link to="/checkout">
              <button className="mt-4 bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-blue-600 transition-colors duration-300">
                Tiến hành thanh toán
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
