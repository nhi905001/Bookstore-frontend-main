import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getProductById, updateProduct } from '../../api/productService';
import RichTextEditor from '../../components/RichTextEditor';

const AdminProductEditPage = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useAuth();

  const [name, setName] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [price, setPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState(0);
  const [publisher, setPublisher] = useState('');
  const [publishedYear, setPublishedYear] = useState('');
  const [pageCount, setPageCount] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [featured, setFeatured] = useState(false);
  const [bestseller, setBestseller] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await getProductById(productId);
        setName(data.name);
        setAuthor(data.author);
        setDescription(data.description);
        setCategory(data.category);
        setImageUrl(data.imageUrl);
        setPrice(data.price ?? '');
        setSalePrice(data.salePrice ?? '');
        setStock(data.stock ?? 0);
        setPublisher(data.publisher ?? '');
        setPublishedYear(data.publishedYear ?? '');
        setPageCount(data.pageCount ?? '');
        setRating(data.rating ?? 0);
        setReviewCount(data.reviewCount ?? 0);
        setFeatured(Boolean(data.featured));
        setBestseller(Boolean(data.bestseller));
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin sản phẩm.');
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      await updateProduct(
        productId,
        {
          name,
          author,
          description,
          category,
          imageUrl,
          price: Number(price),
          salePrice: salePrice ? Number(salePrice) : undefined,
          stock: Number(stock),
          publisher,
          publishedYear: publishedYear ? Number(publishedYear) : undefined,
          pageCount: pageCount ? Number(pageCount) : undefined,
          rating: Number(rating),
          reviewCount: Number(reviewCount),
          featured,
          bestseller,
        },
        userInfo.token
      );
      navigate('/admin/products');
    } catch (err) {
      setError('Cập nhật sản phẩm thất bại.');
      setUpdateLoading(false);
    }
  };

  if (loading) return <p>Đang tải...</p>;

  return (
    <div>
      <Link to="/admin/products" className="mb-4 inline-block text-gray-600 hover:text-gray-800"> &larr; Quay lại danh sách</Link>
      <h1 className="text-3xl font-bold mb-6">Chỉnh sửa Sản phẩm</h1>
      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
      <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Tên sách</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tác giả</label>
            <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Danh mục</label>
            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nhà xuất bản</label>
            <input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Năm xuất bản</label>
            <input type="number" value={publishedYear} onChange={(e) => setPublishedYear(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số trang</label>
            <input type="number" value={pageCount} onChange={(e) => setPageCount(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Giá bán</label>
            <input type="number" min="0" step="1000" value={price} onChange={(e) => setPrice(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Giá khuyến mãi</label>
            <input type="number" min="0" step="1000" value={salePrice} onChange={(e) => setSalePrice(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tồn kho</label>
            <input type="number" min="0" value={stock} onChange={(e) => setStock(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL Hình ảnh</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Đánh giá trung bình (0 - 5)</label>
            <input type="number" step="0.1" min="0" max="5" value={rating} onChange={(e) => setRating(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Số lượt đánh giá</label>
            <input type="number" min="0" value={reviewCount} onChange={(e) => setReviewCount(e.target.value)} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-3 focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <span className="text-sm text-gray-700">Đánh dấu là sách nổi bật</span>
          </label>
          <label className="flex items-center space-x-3">
            <input type="checkbox" checked={bestseller} onChange={(e) => setBestseller(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <span className="text-sm text-gray-700">Đánh dấu là sách bán chạy</span>
          </label>
        </div>

      <RichTextEditor
        label="Mô tả"
        value={description}
        onChange={setDescription}
        placeholder="Chỉnh sửa nội dung mô tả với đầy đủ định dạng"
      />

        <button type="submit" disabled={updateLoading} className="w-full bg-indigo-600 text-white font-bold py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-400">
          {updateLoading ? 'Đang cập nhật...' : 'Cập nhật Sản phẩm'}
        </button>
      </form>
    </div>
  );
};

export default AdminProductEditPage;

