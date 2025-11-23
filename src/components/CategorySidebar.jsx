import React from 'react';

const CategorySidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <aside className="w-full md:w-1/4 lg:w-1/5 p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">Danh Mục</h3>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category}>
            <button
              onClick={() => onSelectCategory(category)}
              className={`w-full text-left px-4 py-2 rounded-md transition-colors duration-200 font-semibold ${ 
                selectedCategory === category
                  ? 'bg-gray-800 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}>
              {category}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default CategorySidebar;

