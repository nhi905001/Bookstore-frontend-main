import React from 'react';

const HeroBanner = () => {
  return (
    <div className="relative bg-gray-800 text-white py-20 px-8 md:px-20 text-center">
      <div 
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=1887&auto=format&fit=crop')` }}
      ></div>
      <div className="relative z-10">
        <h1 className="text-5xl font-extrabold mb-4">Tìm Cuốn Sách Yêu Thích Tiếp Theo</h1>
        <p className="text-xl mb-8">Khám phá bộ sưu tập sách chọn lọc của chúng tôi từ mọi thể loại.</p>
        <a href="#featured-books" className="bg-white text-gray-800 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-colors duration-300">
          Mua Ngay
        </a>
      </div>
    </div>
  );
};

export default HeroBanner;
