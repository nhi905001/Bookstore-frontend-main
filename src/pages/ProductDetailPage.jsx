import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById, getRelatedProducts } from '../api/productService';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { formatCurrency } from '../utils/formatCurrency';
import GoBackButton from '../components/GoBackButton';
import { toast } from 'react-hot-toast';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const [productRes, relatedRes] = await Promise.all([
          getProductById(id),
          getRelatedProducts(id),
        ]);
        setProduct(productRes.data);
        setRelatedProducts(relatedRes.data);
        setQuantity(1);
      } catch (err) {
        setError('Không thể tải chi tiết sản phẩm.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success('Đã thêm vào giỏ hàng!');
  };

  if (loading) {
    return <div className="container mx-auto text-center py-12">Đang tải...</div>;
  }

  if (error) {
    return <div className="container mx-auto text-center py-12 text-red-500">{error}</div>;
  }

  if (!product) {
    return <div className="container mx-auto text-center py-12">Không tìm thấy sản phẩm.</div>;
  }

  return (
    <div className="bg-white py-12">
      <div className="container mx-auto px-8 md:px-20">
        <GoBackButton />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <div className="flex justify-center items-center p-4 border rounded-lg bg-gray-50">
            <img src={product.imageUrl} alt={product.name} className="w-full max-w-sm h-auto object-contain rounded-md" />
          </div>
          <div className="flex flex-col h-full">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
            <p className="text-xl text-gray-500 mb-4">Tác giả: {product.author}</p>
            
            {/* Rating */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <span className="text-yellow-500 text-2xl">★</span>
                <span className="text-xl font-semibold ml-2">{product.rating.toFixed(1)}</span>
                {product.reviewCount && (
                  <span className="text-gray-600 ml-2">({product.reviewCount} đánh giá)</span>
                )}
              </div>
            )}

            <Link to={`/category/${product.category}`} className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold mb-4 px-3 py-1 rounded-full hover:bg-blue-200 self-start">
              {product.category}
            </Link>

            {/* Price */}
            <div className="mb-6">
              {product.salePrice ? (
                <div>
                  <span className="text-gray-400 line-through text-2xl">{formatCurrency(product.price)}</span>
                  <span className="text-4xl font-bold text-blue-600 ml-4">{formatCurrency(product.salePrice)}</span>
                </div>
              ) : (
                <p className="text-4xl font-bold text-blue-600">{formatCurrency(product.price)}</p>
              )}
            </div>

            {/* Product Details */}
            <div className="mb-6 space-y-2 text-gray-700">
              {product.publisher && (
                <p><span className="font-semibold">Nhà xuất bản:</span> {product.publisher}</p>
              )}
              {product.publishedYear && (
                <p><span className="font-semibold">Năm xuất bản:</span> {product.publishedYear}</p>
              )}
              {product.pageCount && (
                <p><span className="font-semibold">Số trang:</span> {product.pageCount}</p>
              )}
              <p><span className="font-semibold">Tình trạng:</span> 
                <span className={product.stock > 0 ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                  {product.stock > 0 ? `Còn hàng (${product.stock} cuốn)` : 'Hết hàng'}
                </span>
              </p>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Mô tả</h2>
              <p className="text-gray-700 leading-relaxed text-justify whitespace-pre-line">{product.description}</p>
            </div>

            <div className="mt-auto pt-8 flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                      className="px-4 py-2 text-lg font-bold"
                      disabled={product.stock === 0}
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        const maxQty = product.stock || 1;
                        setQuantity(Math.min(Math.max(1, val), maxQty));
                      }}
                      min="1"
                      max={product.stock || 1}
                      className="w-16 text-center border-l border-r text-lg font-bold" 
                    />
                    <button 
                      onClick={() => setQuantity(q => Math.min(q + 1, product.stock || 1))} 
                      className="px-4 py-2 text-lg font-bold"
                      disabled={product.stock === 0 || quantity >= (product.stock || 1)}
                    >
                      +
                    </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-grow font-bold py-3 px-8 rounded-md transition-colors duration-300 ${
                    product.stock === 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {product.stock === 0 ? 'Hết hàng' : 'Thêm vào giỏ'}
                </button>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Sản phẩm liên quan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
