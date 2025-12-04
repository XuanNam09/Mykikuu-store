// components/ProductModal.jsx
import React, { useState } from 'react';

function ProductModal({ product, closeModal, addToCart }) {
  const [selectedSize, setSelectedSize] = useState('');
  const sizes = product.sizes ? product.sizes.split(',').map(s => s.trim()) : ['M'];

  const handleAdd = () => {
    if (!selectedSize && sizes.length > 1) {
      alert('Vui lòng chọn kích thước!');
      return;
    }
    addToCart(product, selectedSize || sizes[0]);
    closeModal();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeModal}>
      <div className="bg-white rounded-3xl max-w-4xl w-full p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
        <button onClick={closeModal} className="float-right text-4xl text-gray-500">&times;</button>
        <div className="grid md:grid-cols-2 gap-8">
          <img src={product.image} alt={product.name} className="rounded-2xl w-full h-96 object-cover" />
          <div>
            <h2 className="text-3xl font-bold mb-4">{product.name}</h2>
            <p className="text-2xl text-orange-500 font-bold mb-6">{product.price.toLocaleString('vi-VN')} đ</p>
            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-6">
              <p className="font-semibold mb-3">Chọn kích thước:</p>
              <div className="flex gap-3 flex-wrap">
                {sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-3 rounded-xl border-2 font-bold ${selectedSize === size ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-300'}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleAdd}
              className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold text-xl hover:bg-orange-600 transition"
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;