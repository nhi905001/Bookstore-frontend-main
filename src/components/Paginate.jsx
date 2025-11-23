import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, isAdmin = false, keyword = '', category = '', basePath = '' }) => {
  if (pages <= 1) {
    return null;
  }

  const getPageLink = (p) => {
    const pageNum = p + 1;
    if (isAdmin) {
      return `${basePath}/page/${pageNum}`;
    }
    if (category) {
      return `/category/${category}/page/${pageNum}`;
    }
    if (keyword) {
      return `/search?q=${keyword}&page=${pageNum}`;
    }
    return `/page/${pageNum}`;
  };

  return (
    <div className="flex justify-center mt-12">
      <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        {[...Array(pages).keys()].map((p) => (
          <Link
            key={p + 1}
            to={getPageLink(p)}
            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
              p + 1 === page
                ? 'z-10 bg-gray-800 border-gray-800 text-white'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            }`}
          >
            {p + 1}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Paginate;
