import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent Link navigation
    e.stopPropagation(); // Stop event bubbling
    addToCart(product);
    toast.success('Đã thêm vào giỏ hàng!');
  };

  return (
    <Link to={`/product/${product._id}`} className="group relative flex flex-col bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-shadow duration-300">
      <div className="relative overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" 
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-bold text-gray-800 truncate mb-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-2">Tác giả: {product.author}</p>
        
        {/* Rating */}
        {product.rating && (
          <div className="flex items-center mb-2">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 ml-1">
              {product.rating.toFixed(1)} {product.reviewCount ? `(${product.reviewCount})` : ''}
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mb-4 mt-auto">
          {product.salePrice ? (
            <div>
              <span className="text-gray-400 line-through text-sm">{formatCurrency(product.price)}</span>
              <span className="text-2xl font-extrabold text-primary ml-2">{formatCurrency(product.salePrice)}</span>
            </div>
          ) : (
            <p className="text-2xl font-extrabold text-primary">{formatCurrency(product.price)}</p>
          )}
        </div>

        {/* Stock status */}
        {product.stock !== undefined && (
          <p className={`text-xs mb-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `Còn ${product.stock} cuốn` : 'Hết hàng'}
          </p>
        )}

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full font-bold py-2 px-4 rounded-md transition-colors duration-300 relative z-10 ${
            product.stock === 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-primary text-white hover:bg-blue-600'
          }`}
        >
          {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
