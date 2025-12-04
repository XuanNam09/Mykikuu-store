// src/components/CategoriesSection.jsx - ĐẸP CHUẨN SHOPEE 2025 + ICON ĐẸP + ẤN XEM CHI TIẾT NGAY
import React, { useState, useEffect } from 'react';

function CategoriesSection({ isVisible, showProductModal }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    fetch('http://localhost:8000/products')
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isVisible]);

  const getProductsByCategory = (catId) => {
    return allProducts.filter(p => p.category === catId);
  };

  const categories = [
    { id: 'clothing', name: 'Quần áo', icon: '👔', count: getProductsByCategory('clothing').length },
    { id: 'shoes', name: 'Giày dép', icon: '👟', count: getProductsByCategory('shoes').length },
    { id: 'bags', name: 'Túi xách', icon: '👜', count: getProductsByCategory('bags').length },
    { id: 'accessories', name: 'Phụ kiện', icon: '⌚', count: getProductsByCategory('accessories').length }
  ];

  const selectedProducts = selectedCategory ? getProductsByCategory(selectedCategory) : [];

  const formatPrice = (price) => new Intl.NumberFormat('vi-VN').format(price) + 'đ';

  if (!isVisible) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Tiêu đề */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Danh mục sản phẩm
          </h2>
          <p className="text-xl text-gray-600">Chọn danh mục để khám phá ngay hôm nay!</p>
        </div>

        {/* DANH MỤC - ICON ĐẸP, KHÔNG PHÓNG TO */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          {categories.map(cat => (
            <div
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`group bg-white rounded-3xl p-10 text-center cursor-pointer transition-all duration-500 transform hover:scale-105 hover:shadow-2xl border-2 ${
                selectedCategory === cat.id ? 'border-orange-500 shadow-2xl' : 'border-gray-200'
              }`}
            >
              <div className="text-7xl mb-6">{cat.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-orange-600 transition">
                {cat.name}
              </h3>
              <p className="text-orange-600 font-semibold text-lg">
                {cat.count} sản phẩm
              </p>
            </div>
          ))}
        </div>

        {/* SẢN PHẨM - ĐẸP CHUẨN SHOPEE, KHÔNG TO, CÓ THỂ ẤN XEM CHI TIẾT */}
        {selectedCategory && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-4xl font-bold text-gray-800">
                {categories.find(c => c.id === selectedCategory)?.name}
              </h3>
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-orange-600 font-bold text-lg hover:underline"
              >
                ← Quay lại danh mục
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {selectedProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => showProductModal(product)}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
                >
                  <div className="relative overflow-hidden bg-gray-100">
                    <img
                      src={product.image || "https://via.placeholder.com/300"}
                      alt={product.name}
                      className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                      -20%
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-bold text-gray-800 line-clamp-2 mb-2 text-base">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-orange-600 font-bold text-xl">
                        {formatPrice(product.price)}
                      </p>
                      <p className="text-gray-500 text-sm line-through">
                        {formatPrice(product.price * 1.3)}
                      </p>
                    </div>
                    <button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl shadow-lg transform hover:scale-105 transition text-base">
                      Chi Tiết Sản Phẩm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default CategoriesSection;