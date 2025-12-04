import React, { useEffect, useState } from "react";

function MyOrders({ username, refreshKey }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetch(`http://localhost:8000/orders/${username}`)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => {
        setOrders([]);
        setLoading(false);
      });
  }, [username, refreshKey]);

  if (!username) return <div className="p-8 text-center">Vui lòng đăng nhập</div>;
  if (loading) return <div className="p-8 text-center">Đang tải đơn hàng...</div>;

  return (
    <div className="container mx-auto px-6 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">Đơn hàng của tôi</h2>
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">Chưa có đơn hàng nào</p>
      ) : (
        <div className="grid gap-6">
          {orders.map(order => (
            <div key={order.order.id} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Đơn hàng #{order.order.id}</h3>
                <span className={`px-4 py-2 rounded-full text-white ${order.order.status === 'pending' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                  {order.order.status === 'pending' ? 'Chờ xử lý' : 'Đã xác nhận'}
                </span>
              </div>
              <p>Tổng tiền: <strong>{order.order.total_price.toLocaleString('vi-VN')} đ</strong></p>
              <div className="mt-4">
                <p className="font-semibold mb-2">Sản phẩm:</p>
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span>{item.product_name || 'Sản phẩm'} x{item.quantity} (Size: {item.size})</span>
                    <span>{(item.price * item.quantity).toLocaleString('vi-VN')} đ</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyOrders;