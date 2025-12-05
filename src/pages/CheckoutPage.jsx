import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getCart, clearCart } from "../api/cartService";
import { createOrder } from "../api/orderService";
import { formatCurrency } from "../utils/formatCurrency";

const CheckoutPage = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login?redirect=/checkout");
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await getCart(userInfo.token);
        setCart(res.data.items || []);
      } catch (err) {
        console.error(err);
        setError("Không thể tải giỏ hàng.");
      } finally {
        setLoadingCart(false);
      }
    };

    fetchCart();
  }, [userInfo, navigate]);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingOrder(true);
    setError("");

    const orderItems = cart.map((item) => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
    }));

    const orderData = {
      orderItems,
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
      await clearCart(userInfo.token);
      setIsOrderPlaced(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Không thể đặt hàng. Vui lòng thử lại."
      );
    } finally {
      setLoadingOrder(false);
    }
  };

  if (loadingCart) {
    return (
      <div className="container mx-auto px-8 py-12 text-center">
        Đang tải giỏ hàng...
      </div>
    );
  }

  if (isOrderPlaced) {
    return (
      <div className="container mx-auto px-8 md:px-20 py-12 text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">Cảm ơn bạn!</h1>
        <p className="text-lg text-gray-600 mb-8">
          Đơn hàng của bạn đã được đặt thành công.
        </p>
        <button
          onClick={() => navigate("/my-account/orders")}
          className="bg-gray-800 text-white font-bold py-3 px-8 rounded-md hover:bg-gray-900"
        >
          Xem Lịch Sử Đơn Hàng
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-8 md:px-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Thanh Toán
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT FORM */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Thông tin giao hàng
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md p-3"
                />
              </div>

              <button
                type="submit"
                disabled={loadingOrder || cart.length === 0}
                className="w-full bg-gray-800 text-white font-bold py-3 rounded-md hover:bg-gray-900 disabled:bg-gray-400"
              >
                {loadingOrder ? "Đang xử lý..." : "Đặt hàng"}
              </button>
            </form>
          </div>

          {/* RIGHT ORDER SUMMARY */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Tóm tắt đơn hàng
            </h2>

            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.product._id} className="flex justify-between">
                  <span className="text-gray-600">
                    {item.product.name} (x{item.quantity})
                  </span>
                  <span className="font-semibold text-gray-800">
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
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
