import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProducts, getCategories, getProductsByCategory } from '../api/productService';
import ProductCard from '../components/ProductCard';
import HeroBanner from '../components/HeroBanner';
import Paginate from '../components/Paginate';
import ProductCarousel from '../components/ProductCarousel';
import CategorySidebar from '../components/CategorySidebar';

const HomePage = () => {
  const { pageNumber = 1, category = 'Tất cả' } = useParams();

  const [products, setProducts] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestsellerProducts, setBestsellerProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const { data } = await getCategories();
        setCategories(['Tất cả', ...data]);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        let data;
        if (selectedCategory === 'Tất cả') {
          data = (await getProducts(pageNumber)).data;
        } else {
          data = (await getProductsByCategory(selectedCategory, pageNumber)).data;
        }
        setProducts(data.products);
        setPage(data.page);
        setPages(data.pages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [pageNumber, selectedCategory]);

  useEffect(() => {
    const loadFeaturedAndBestseller = async () => {
      try {
        const [featuredData, bestsellerData] = await Promise.all([
          getProducts(1, true, false),
          getProducts(1, false, true),
        ]);
        setFeaturedProducts(featuredData.data.products || []);
        setBestsellerProducts(bestsellerData.data.products || []);
      } catch (error) {
        console.error('Failed to fetch featured/bestseller products:', error);
      }
    };
    loadFeaturedAndBestseller();
  }, []);

  return (
    <main>
      <HeroBanner />

      <section id="all-books" className="bg-white py-12">
        <div className="container mx-auto px-8 md:px-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Tất Cả Sách</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <CategorySidebar 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <div className="w-full md:w-3/4 lg:w-4/5">
              {loading ? (
                <p className="text-center">Đang tải...</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {products.map(product => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </div>
                  <Paginate pages={pages} page={page} category={selectedCategory !== 'Tất cả' ? selectedCategory : ''} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {featuredProducts.length > 0 && (
        <section id="featured-books" className="bg-gray-50 py-12">
          <div className="container mx-auto px-8 md:px-20">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Sách Nổi Bật</h2>
            <ProductCarousel products={featuredProducts} />
          </div>
        </section>
      )}

      {bestsellerProducts.length > 0 && (
        <section id="bestseller-books" className="bg-white py-12">
          <div className="container mx-auto px-8 md:px-20">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-10">Sách Bán Chạy</h2>
            <ProductCarousel products={bestsellerProducts} />
          </div>
        </section>
      )}
    </main>
  );
};

export default HomePage;
