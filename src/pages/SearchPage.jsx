import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProductByName } from '../api/productService';
import ProductCard from '../components/ProductCard';
import Paginate from '../components/Paginate';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const pageNumber = searchParams.get('page') || 1;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setLoading(false);
      return;
    }

    const fetchSearchResults = async () => {
      try {
        setLoading(true);
        const { data } = await getProductByName(query, pageNumber);
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
      } catch (err) {
        setError('Không thể tải kết quả tìm kiếm.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, pageNumber]);

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-8 md:px-20">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Kết quả tìm kiếm cho: "{query}"
        </h1>
        {loading ? (
          <div className="text-center">Đang tải...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
            <Paginate pages={pages} page={page} keyword={query} />
          </>
        ) : (
          <div className="text-center text-gray-600">
            <p>Không tìm thấy sản phẩm nào phù hợp với từ khóa của bạn.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
