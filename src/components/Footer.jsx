import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-8 md:px-20 text-center">
        <p>&copy; {new Date().getFullYear()} Tiệm Sách. Đã đăng ký bản quyền.</p>
        <p className="text-sm text-gray-400 mt-2">Thiết kế & Phát triển bởi Bạn</p>
      </div>
    </footer>
  );
};

export default Footer;
