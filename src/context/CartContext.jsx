import React, { createContext, useContext, useState } from "react";
import { useAuth } from "./AuthContext";
import { addToCart as addToCartApi } from "../api/cartService";
import { toast } from "react-hot-toast";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);
console.log(useAuth);

export const CartProvider = ({ children }) => {
  const { userInfo } = useAuth(); // <-- Lấy token ở đây
  const [cartItems, setCartItems] = useState([]);

  const addToCart = async (product, quantity = 1) => {
    if (!userInfo?.token) {
      toast.error("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      return;
    }

    try {
      const data = await addToCartApi(product._id, quantity, userInfo.token);
      setCartItems(data.items); // Cập nhật giỏ hàng từ API
      toast.success("Đã thêm vào giỏ hàng!");
    } catch (err) {
      toast.error("Thêm giỏ hàng thất bại");
      console.error(err);
    }
  };

  const value = {
    cartItems,
    addToCart,
    // updateQuantity, removeFromCart, clearCart...
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
