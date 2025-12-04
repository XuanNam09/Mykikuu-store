import React from 'react';

function Header({ showSection, toggleCart, toggleAuth, cartCount, user, handleLogout }) {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-lg border-b">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-10">
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition"
            onClick={() => showSection('home')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              K
            </div>
            <h1 className="text-3xl font-bold text-orange-600">Kikuu Store</h1>
          </div>

          <nav className="hidden lg:flex space-x-8">
            {['home', 'products', 'categories', 'about', 'contact'].map(s => (
              <button
                key={s}
                onClick={() => showSection(s)}
                className="text-gray-700 hover:text-orange-600 font-semibold text-lg transition"
              >
                {s === 'home' ? 'Trang chủ' : s === 'products' ? 'Sản phẩm' : s === 'categories' ? 'Danh mục' : s === 'about' ? 'Về chúng tôi' : 'Liên hệ'}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleCart}
            className="relative bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2 transition transform hover:scale-105"
          >
            Giỏ hàng
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-sm font-bold rounded-full w-7 h-7 flex items-center justify-center animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-800 font-medium">
                Xin chào, <strong className="text-orange-600">{user.username}</strong>
              </span>

              <button
                onClick={() => showSection('myorders')}
                className="text-orange-600 font-bold hover:underline"
              >
                Đơn hàng
              </button>

              {/* NÚT QUẢN TRỊ – SIÊU ĐẸP */}
              {user.is_admin && (
                <button
                  onClick={() => showSection('admin')}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-2xl font-bold shadow-xl transform hover:scale-110 transition duration-300"
                >
                  Quản Trị
                </button>
              )}

              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-2xl font-bold transition"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            <button
              onClick={toggleAuth}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-10 py-3 rounded-2xl font-bold shadow-lg transition transform hover:scale-105"
            >
              Đăng nhập / Đăng ký
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;