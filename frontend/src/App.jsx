import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeSection from './components/HomeSection';
import ProductsSection from './components/ProductsSection';
import CategoriesSection from './components/CategoriesSection';
import AboutSection from './components/AboutSection';
import ContactSection from './components/ContactSection';
import CartSidebar from './components/CartSidebar';
import ProductModal from './components/ProductModal';
import CheckoutModal from './components/CheckoutModal';
import AuthModal from './components/AuthModal';
import MyOrders from './pages/MyOrders';
import AdminPage from './pages/AdminPage';

function App() {
  const [currentSection, setCurrentSection] = useState('home');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notification, setNotification] = useState(null);
  const [showOrders, setShowOrders] = useState(false);
  const [ordersRefresh, setOrdersRefresh] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (token && username) {
      setUser({ token, username, is_admin: isAdmin });
      if (isAdmin) setCurrentSection('admin');
    }
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  useEffect(() => {
    fetch('http://localhost:8000/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(() => {
        const mockCategories = ['clothing', 'shoes', 'bags', 'accessories'];
        setCategories(mockCategories);
      });
  }, []);

  useEffect(() => {
    let url = 'http://localhost:8000/products';
    if (selectedCategory) {
      url += `?category=${encodeURIComponent(selectedCategory)}`;
    }
    fetch(url)
      .then(res => res.json())
      .then(setProducts)
      .catch(() => {});
  }, [selectedCategory]);

  // ĐÃ SỬA: Không hiện chữ "Success" nữa, chỉ hiện message
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000); // Giảm thời gian xuống 3s cho gọn
  };

  const handleLogin = (username, token, is_admin = false) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('is_admin', is_admin);
    setUser({ token, username, is_admin });
    showNotification(`Chào mừng ${is_admin ? 'Quản trị viên' : ''} ${username}!`);
    setIsAuthOpen(false);
    if (is_admin) {
      setCurrentSection('admin');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCart([]);
    setCurrentSection('home');
    showNotification('Đã đăng xuất thành công');
  };

  const addToCart = (product, size = null) => {
    setCart(prev => {
      const key = size ? `${product.id}-${size}` : product.id;
      const exist = prev.find(i => (size ? `${i.id}-${i.size}` : i.id) === key);
      if (exist) {
        return prev.map(i => i === exist ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...product, size, quantity: 1 }];
    });
    showNotification(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  const removeFromCart = (id, size = null) => {
    const key = size ? `${id}-${size}` : id;
    setCart(prev => prev.filter(i => (size ? `${i.id}-${i.size}` : i.id) !== key));
  };

  const updateQuantity = (id, size = null, delta) => {
    const key = size ? `${id}-${size}` : id;
    setCart(prev => prev
      .map(i => {
        if ((size ? `${i.id}-${i.size}` : i.id) === key) {
          const newQty = i.quantity + delta;
          return newQty > 0 ? { ...i, quantity: newQty } : null;
        }
        return i;
      })
      .filter(Boolean)
    );
  };

  const openCheckout = () => {
    if (!user) {
      showNotification('Vui lòng đăng nhập để thanh toán!', 'error');
      setIsAuthOpen(true);
      return;
    }
    if (cart.length === 0) {
      showNotification('Giỏ hàng trống!', 'error');
      return;
    }
    setIsCheckoutOpen(true);
  };

  const toggleCart = () => setIsCartOpen(prev => !prev);
  const closeProductModal = () => setSelectedProduct(null);

  // BỔ SUNG: Giữ trạng thái đơn hàng khi F5
  useEffect(() => {
    if (currentSection === 'myorders' && user) {
      setShowOrders(true);
    }
  }, [currentSection, user]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        showSection={setCurrentSection}
        toggleCart={toggleCart}
        toggleAuth={() => setIsAuthOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        user={user}
        handleLogout={handleLogout}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <main className="pt-20 flex-grow">
        {currentSection === 'admin' && user?.is_admin ? (
          <AdminPage token={user.token} showNotification={showNotification} />
        ) : (showOrders || currentSection === 'myorders') ? (
          <MyOrders username={user?.username} refreshKey={ordersRefresh} />
        ) : (
          <>
            <HomeSection isVisible={currentSection === 'home'} products={products} />
            <ProductsSection
              isVisible={currentSection === 'products'}
              products={products}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              showProductModal={setSelectedProduct}
              addToCart={addToCart}
              searchTerm={searchTerm}
            />
            {/* ĐÃ BỔ SUNG showProductModal CHO DANH MỤC */}
            <CategoriesSection
              isVisible={currentSection === 'categories'}
              showProductModal={setSelectedProduct}
            />
            <AboutSection isVisible={currentSection === 'about'} />
            <ContactSection isVisible={currentSection === 'contact'} showNotification={showNotification} />
          </>
        )}
      </main>

      <CartSidebar
        isOpen={isCartOpen}
        cart={cart}
        toggleCart={toggleCart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        openCheckout={openCheckout}
        showNotification={showNotification}
      />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          closeModal={closeProductModal}
          addToCart={addToCart}
        />
      )}

      {isCheckoutOpen && user && (
        <CheckoutModal
          cart={cart}
          closeModal={() => setIsCheckoutOpen(false)}
          showNotification={showNotification}
          user={user}
          clearCart={() => setCart([])}
          onSuccess={() => {
            setOrdersRefresh(prev => prev + 1);
            setShowOrders(true);
            setIsCheckoutOpen(false);
            setCurrentSection('myorders');
          }}
        />
      )}

      {isAuthOpen && (
        <AuthModal toggleAuth={() => setIsAuthOpen(false)} showNotification={showNotification} handleLogin={handleLogin} />
      )}

      {notification && (
        <div className={`fixed top-24 right-6 z-50 p-5 rounded-2xl text-white font-bold shadow-2xl transition-all duration-500 ${
          notification.type === 'success'
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-red-500 to-pink-600'
        }`}>
          <div className="flex items-center gap-3">
            <div>{notification.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;