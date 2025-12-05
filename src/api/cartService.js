import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api/cart";

// =====================
// Public Cart Functions
// =====================

// Get cart of logged-in user
export const getCart = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return axios.get(API_URL, config);
};

// Add product to cart
export const addToCart = async (productId, quantity, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const body = { productId, quantity };

  const response = await axios.post(`${API_URL}/add`, body, config);
  return response.data;
};

// Update item quantity in cart
export const updateCartItem = async (productId, quantity, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const body = { quantity };

  const response = await axios.put(
    `${API_URL}/update/${productId}`,
    body,
    config
  );
  return response.data;
};

// Remove item from cart
export const removeCartItem = async (productId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/remove/${productId}`, config);
  return response.data;
};

// Clear entire cart
export const clearCart = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.delete(`${API_URL}/clear`, config);
  return response.data;
};
