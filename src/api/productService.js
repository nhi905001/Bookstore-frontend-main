import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/products";

// Public functions
export const getProducts = (pageNumber = '', featured = false, bestseller = false) => {
  let url = `${API_URL}?pageNumber=${pageNumber}`;
  if (featured) url += '&featured=true';
  if (bestseller) url += '&bestseller=true';
  return axios.get(url);
};
export const getProductById = (id) => axios.get(`${API_URL}/${id}`);
export const getRelatedProducts = (id) => axios.get(`${API_URL}/${id}/related`);
export const getProductByName = (name = '', pageNumber = '') =>
  axios.get(`${API_URL}/search?name=${name}&pageNumber=${pageNumber}`);
export const getCategories = () => axios.get(`${API_URL}/categories`);
export const getProductsByCategory = (categoryName, pageNumber = '') =>
  axios.get(`${API_URL}/category/${categoryName}?pageNumber=${pageNumber}`);

// Admin functions
export const createProduct = async (productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, productData, config);
  return response.data;
};

export const updateProduct = async (id, productData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.put(`${API_URL}/${id}`, productData, config);
  return response.data;
};

export const deleteProduct = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/${id}`, config);
  return response.data;
};
