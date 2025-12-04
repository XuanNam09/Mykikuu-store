// components/CheckoutModal.jsx - ĐẸP NHƯ SHOPEE + NHẬP THÔNG TIN
import React, { useState } from 'react';

export default function CheckoutModal({ cart, closeModal, showNotification, user, clearCart, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    recipient_name: '',
    address: '',
    phone: ''
  });

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckout = async () => {
    if (!form.recipient_name || !form.address || !form.phone) {
      showNotification('Vui lòng điền đầy đủ thông tin!', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          username: user.username,
          recipient_name: form.recipient_name,
          address: form.address,
          phone: form.phone,
          items: cart.map(i => ({
            product_id: i.id,
            size: i.size || null,
            quantity: i.quantity,
            price: i.price
          }))
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Đặt hàng thất bại');
      }

      showNotification('Đặt hàng thành công! Cảm ơn bạn!', 'success');
      clearCart();
      closeModal();
      onSuccess?.();
    } catch (err) {
      showNotification(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={closeModal}>
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-screen overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-3xl font-bold text-center mb-6 text-orange-600">Thông Tin Giao Hàng</h2>

        {/* Form nhập thông tin */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="recipient_name"
            placeholder="Họ và tên người nhận"
            value={form.recipient_name}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
          <input
            type="text"
            name="phone"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none"
          />
          <input
            type="text"
            name="address"
            placeholder="Địa chỉ nhận hàng (số nhà, đường, phường...)"
            value={form.address}
            onChange={handleChange}
            className="px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-500 focus:outline-none md:col-span-2"
          />
        </div>

        {/* Danh sách sản phẩm */}
        <div className="space-y-3 mb-6">
          {cart.map(item => (
            <div key={`${item.id}-${item.size}`} className="flex justify-between text-gray-700 bg-gray-50 p-3 rounded-xl">
              <span>{item.name} × {item.quantity} {item.size && `(Size ${item.size})`}</span>
              <span className="font-bold">{(item.price * item.quantity).toLocaleString()}đ</span>
            </div>
          ))}
        </div>

        <div className="border-t-4 border-orange-300 pt-4 mb-6">
          <p className="text-right text-3xl font-bold text-orange-600">
            Tổng tiền: {total.toLocaleString()}đ
          </p>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-5 rounded-2xl font-bold text-2xl shadow-2xl transform hover:scale-105 transition disabled:opacity-70"
        >
          {loading ? 'Đang xử lý...' : 'XÁC NHẬN ĐẶT HÀNG'}
        </button>

        <button onClick={closeModal} className="w-full mt-4 text-gray-600 font-medium">
          Hủy bỏ
        </button>
      </div>
    </div>
  );
}