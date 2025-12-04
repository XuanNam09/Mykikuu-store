import React, { useState, useEffect } from 'react';

function ProductsSection({ isVisible, showProductModal }) {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Load sản phẩm từ backend
  useEffect(() => {
    if (!isVisible) return;
    fetch('http://localhost:8000/products')
      .then(res => res.json())
      .then(data => {
        setAllProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isVisible]);

  // Lọc sản phẩm khi gõ tìm kiếm
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(allProducts);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = allProducts.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, allProducts]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  if (!isVisible) return null;

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Tiêu đề + Ô tìm kiếm */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Sản Phẩm Nổi Bật
          </h2>

          {/* Ô TÌM KIẾM ĐẸP NHƯ SHOPEE */}
          <div className="max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm... (áo, váy, jeans...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-6 py-4 pr-14 rounded-full border-2 border-gray-200 focus:border-orange-500 focus:outline-none text-lg shadow-md transition-all"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Hiển thị số kết quả */}
          {searchQuery && (
            <p className="mt-4 text-gray-600">
              Tìm thấy <strong>{filteredProducts.length}</strong> sản phẩm cho "<em>{searchQuery}</em>"
            </p>
          )}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-500">Không tìm thấy sản phẩm nào</p>
            <p className="text-gray-400 mt-2">Hãy thử từ khóa khác nhé!</p>
          </div>
        ) : (
          /* Danh sách sản phẩm - GỌN GÀNG, ĐẸP CHUẨN */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => showProductModal(product)}
                className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group"
              >
                <div className="relative overflow-hidden bg-gray-100">
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="w-full h-48 sm:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                </div>

                <div className="p-3 sm:p-4">
                  <h3 className="font-semibold text-sm sm:text-base text-gray-800 line-clamp-2 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-orange-600 font-bold text-base sm:text-lg mb-3">
                    {formatPrice(product.price)}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      showProductModal(product);
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 rounded-xl text-sm shadow-lg transform hover:scale-105 transition-all"
                  >
                    Chi Tiết Sản Phẩm
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductsSection;