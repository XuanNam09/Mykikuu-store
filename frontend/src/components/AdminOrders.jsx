// AdminOrders.jsx
import React, { useEffect, useState } from "react";
const API_BASE = "http://localhost:8000";

export default function AdminOrders({ adminUsername, adminPassword }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchOrders() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/orders?admin_username=${encodeURIComponent(adminUsername)}&admin_password=${encodeURIComponent(adminPassword)}`);
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail || "Không thể lấy danh sách đơn");
      }
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(()=> {
    if (adminUsername && adminPassword) fetchOrders();
  }, [adminUsername, adminPassword]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}?admin_username=${encodeURIComponent(adminUsername)}&admin_password=${encodeURIComponent(adminPassword)}&status=${encodeURIComponent(newStatus)}`, {
        method: "PUT"
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail || "Cập nhật thất bại");
      }
      await fetchOrders();
      alert("Cập nhật thành công");
    } catch (err) {
      alert(err.message);
    }
  };

  if (!adminUsername || !adminPassword) return <div>Vui lòng nhập thông tin admin để xem</div>;
  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Quản lý đơn hàng (Admin)</h2>
      <ul className="space-y-4">
        {orders.map(o => (
          <li key={o.id} className="p-4 border rounded">
            <div><strong>Mã:</strong> {o.id}</div>
            <div><strong>User ID:</strong> {o.user_id}</div>
            <div><strong>Tên:</strong> {o.recipient_name}</div>
            <div><strong>Địa chỉ:</strong> {o.address}</div>
            <div><strong>Phone:</strong> {o.phone}</div>
            <div><strong>Tổng:</strong> {o.total_price}</div>
            <div><strong>Trạng thái:</strong> {o.status}</div>
            <div className="mt-2 space-x-2">
              <button onClick={()=>updateStatus(o.id, "confirmed")} className="px-2 py-1 bg-blue-500 text-white rounded">Xác nhận</button>
              <button onClick={()=>updateStatus(o.id, "shipping")} className="px-2 py-1 bg-yellow-500 text-white rounded">Đang giao</button>
              <button onClick={()=>updateStatus(o.id, "completed")} className="px-2 py-1 bg-green-500 text-white rounded">Hoàn tất</button>
              <button onClick={()=>updateStatus(o.id, "cancelled")} className="px-2 py-1 bg-red-500 text-white rounded">Hủy</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
