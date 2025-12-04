import React, { useState, useEffect } from 'react';

function AdminPage({ token, showNotification }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Form thêm/sửa sản phẩm
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', image: '', description: '', sizes: 'Freesize', stock: 100, category: 'clothing'
  });

  useEffect(() => {
    if (activeTab === 'stats') loadStats();
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'orders') loadOrders();
    if (activeTab === 'users') loadUsers();
  }, [activeTab, token]);

  const loadStats = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/statistics', { headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) setStats(await res.json());
    } catch { }
  };

  const loadProducts = async () => {
    try {
      const res = await fetch('http://localhost:8000/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch { }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/orders', { headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) {
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } else {
        setOrders([]);
      }
    } catch {
      setOrders([]);
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('http://localhost:8000/admin/users', { headers: { Authorization: `Bearer ${token}` }});
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await fetch(`http://localhost:8000/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      showNotification && showNotification('Cập nhật trạng thái thành công!', 'success');
      loadOrders();
    } catch {
      showNotification && showNotification('Lỗi cập nhật', 'error');
    }
  };

  // === THÊM / SỬA / XÓA SẢN PHẨM THẬT ===
  const openProductForm = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        image: product.image,
        description: product.description || '',
        sizes: product.sizes || 'Freesize',
        stock: product.stock,
        category: product.category || 'clothing'
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', price: '', image: '', description: '', sizes: '', stock: 100, category: 'clothing' });
    }
    setShowProductForm(true);
  };

  const saveProduct = async () => {
    const url = editingProduct
      ? `http://localhost:8000/admin/products/${editingProduct.id}`
      : 'http://localhost:8000/admin/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock)
        })
      });

      if (res.ok) {
        showNotification(editingProduct ? 'Sửa sản phẩm thành công!' : 'Thêm sản phẩm thành công!', 'success');
        setShowProductForm(false);
        loadProducts();
      } else {
        const err = await res.json();
        showNotification(err.detail || 'Lỗi lưu sản phẩm', 'error');
      }
    } catch {
      showNotification('Lỗi kết nối server', 'error');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Xóa sản phẩm này thật chứ?')) return;
    try {
      const res = await fetch(`http://localhost:8000/admin/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        showNotification('Xóa sản phẩm thành công!', 'success');
        loadProducts();
      }
    } catch {
      showNotification('Lỗi xóa sản phẩm', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 pt-24 pb-16">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center text-purple-800 mb-12">QUẢN TRỊ KIKUU</h1>

        {/* TAB ĐẸP */}
        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          {[
            { id: 'stats', label: 'Thống kê', color: 'from-purple-500 to-purple-700' },
            { id: 'products', label: 'Quản lý sản phẩm', color: 'from-blue-500 to-blue-700' },
            { id: 'orders', label: 'Quản lý đơn hàng', color: 'from-green-500 to-green-700' },
            { id: 'users', label: 'Quản lý người dùng', color: 'from-red-500 to-red-700' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-10 py-4 rounded-full font-bold text-lg transition-all shadow-lg ${
                activeTab === tab.id
                  ? `bg-gradient-to-r ${tab.color} text-white`
                  : 'bg-white text-gray-700 hover:shadow-md'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-10">

          {/* THỐNG KÊ - ĐÃ FIX CHỮ ĐẸP, KHÔNG BỊ SÁT MÉP */}
          {activeTab === 'stats' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Tổng đơn hàng */}
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-center items-center transform hover:scale-105 transition">
                <h2 className="text-6xl font-bold mb-3">{stats.total_orders || 0}</h2>
                <p className="text-xl font-medium tracking-wide">Tổng đơn hàng</p>
              </div>

              {/* Doanh thu - ĐÃ FIX HOÀN HẢO */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-center items-center transform hover:scale-105 transition">
                <h2 className="text-5xl font-bold mb-3 tracking-tight text-center">
                  {(stats.total_revenue || 0).toLocaleString()}đ
                </h2>
                <p className="text-xl font-medium tracking-wide">Doanh thu</p>
              </div>

              {/* Sản phẩm đã bán */}
              <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-center items-center transform hover:scale-105 transition">
                <h2 className="text-6xl font-bold mb-3">{stats.total_sold || 0}</h2>
                <p className="text-xl font-medium tracking-wide">Sản phẩm đã bán</p>
              </div>

              {/* Bán chạy nhất */}
              <div className="bg-gradient-to-br from-pink-500 to-purple-700 rounded-3xl p-8 text-white shadow-2xl flex flex-col justify-center items-center transform hover:scale-105 transition">
                <h2 className="text-4xl font-bold text-center leading-tight break-words px-4">
                  {stats.best_sellers?.[0]?.name || 'Chưa có'}
                </h2>
                <p className="text-xl font-medium mt-4 tracking-wide">Bán chạy nhất</p>
              </div>
            </div>
          )}

          {/* QUẢN LÝ ĐƠN HÀNG - CHỮ TRẮNG ĐẸP, RÕ RÀNG */}
          {activeTab === 'orders' && (
            <div>
              <h2 className="text-3xl font-bold text-green-600 mb-8 text-center">Đơn hàng ({orders.length})</h2>
              {orders.length === 0 ? (
                <p className="text-center text-gray-500 py-20 text-xl">Chưa có đơn hàng nào</p>
              ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="bg-gray-50 p-6 rounded-2xl shadow-md">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-xl">#{order.id} • {order.username}</p>
                          <p className="text-gray-600">Người nhận: {order.recipient_name} • {order.phone}</p>
                          <p className="text-gray-600">Địa chỉ: {order.address}</p>
                          <p className="text-xl font-bold text-orange-600 mt-2">{order.total_price.toLocaleString()}đ</p>
                        </div>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="px-8 py-4 rounded-2xl font-bold text-white text-lg shadow-xl transition-all hover:scale-105 cursor-pointer outline-none border-0"
                          style={{
                            background:
                              order.status === 'delivered' ? 'linear-gradient(135deg, #10b981, #059669)' :
                              order.status === 'processing' ? 'linear-gradient(135deg, #059669)' :
                              order.status === 'cancelled' ? 'linear-gradient(135deg, #ef4444, #dc2626)' :
                              'linear-gradient(135deg, #f59e0b, #d97706)',
                            minWidth: '180px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                          }}
                        >
                          <option value="pending"    style={{ backgroundColor: '#f59e0b', color: 'white', fontWeight: 'bold' }}>Đang xử lý</option>
                          <option value="processing" style={{ backgroundColor: '#10b981', color: 'white', fontWeight: 'bold' }}>Xác nhận</option>
                        </select>
                      </div>
                      <div className="border-t pt-3 text-sm text-gray-700">
                        {order.items.map((it, i) => (
                          <p key={i}>• {it.name} x{it.quantity} {it.size ? `(${it.size})` : ''} = {(it.price * it.quantity).toLocaleString()}đ</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QUẢN LÝ NGƯỜI DÙNG - GIỮ NGUYÊN */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-3xl font-bold text-red-600 mb-8 text-center">Người dùng ({users.length})</h2>
              {users.length === 0 ? (
                <p className="text-center text-gray-500 py-20 text-xl">Chưa có người dùng</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map(u => (
                    <div key={u.id} className="bg-gray-50 p-8 rounded-2xl text-center shadow-md">
                      <p className="text-2xl font-bold">{u.username}</p>
                      <p className="text-gray-600">{u.email}</p>
                      <span className={`mt-3 inline-block px-6 py-2 rounded-full text-white font-bold text-sm ${u.is_admin ? 'bg-purple-600' : 'bg-gray-500'}`}>
                        {u.is_admin ? 'Quản trị viên' : 'Khách hàng'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* QUẢN LÝ SẢN PHẨM - ĐÃ CÓ THÊM / SỬA / XÓA THẬT */}
          {activeTab === 'products' && (
            <div>
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-purple-700">Sản phẩm ({products.length})</h2>
                <button
                  onClick={() => openProductForm()}
                  className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-8 py-4 rounded-full font-bold shadow-lg hover:scale-105 transition"
                >
                  + Thêm sản phẩm
                </button>
              </div>

              {/* Form thêm/sửa */}
              {showProductForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-3xl">
                    <h3 className="text-2xl font-bold mb-6 text-purple-700">
                      {editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input placeholder="Tên sản phẩm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="px-6 py-4 border rounded-2xl" required />
                      <input type="number" placeholder="Giá tiền" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="px-6 py-4 border rounded-2xl" required />
                      <input placeholder="Link ảnh" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="px-6 py-4 border rounded-2xl col-span-2" required />
                      <input placeholder="Size (M,L,XL)" value={formData.sizes} onChange={e => setFormData({...formData, sizes: e.target.value})} className="px-6 py-4 border rounded-2xl" />
                      <input type="number" placeholder="Tồn kho" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="px-6 py-4 border rounded-2xl" />
                      <textarea placeholder="Mô tả (tùy chọn)" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="px-6 py-4 border rounded-2xl col-span-2" rows="3"></textarea>
                    </div>
                    <div className="flex justify-end gap-4 mt-8">
                      <button onClick={saveProduct} className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg">Lưu</button>
                      <button onClick={() => setShowProductForm(false)} className="bg-gray-500 hover:bg-gray-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg">Hủy</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Danh sách sản phẩm */}
              <div className="space-y-6">
                {products.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-3xl shadow-md hover:shadow-xl transition">
                    <div className="flex items-center gap-6">
                      <img src={p.image} alt={p.name} className="w-24 h-24 object-cover rounded-2xl shadow-md" />
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">{p.name}</h3>
                        <p className="text-lg text-gray-600">{p.price.toLocaleString()}đ • Còn: <strong>{p.stock}</strong></p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => openProductForm(p)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold shadow-md">Sửa</button>
                      <button onClick={() => deleteProduct(p.id)} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-xl font-bold shadow-md">Xóa</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default AdminPage;
