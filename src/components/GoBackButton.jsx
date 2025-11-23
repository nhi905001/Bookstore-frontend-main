import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate(-1)}
      className="mb-8 inline-block text-gray-600 hover:text-primary font-semibold"
    >
      &larr; Quay lại
    </button>
  );
};

export default GoBackButton;

