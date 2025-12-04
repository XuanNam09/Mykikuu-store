import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:8000";

export default function CheckoutForm({ currentUsername, totalPrice, onSuccess }) {
  const [recipientName, setRecipientName] = useState(currentUsername || "");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/orders",
        {
          username: currentUsername,
          recipient_name: recipientName,
          address,
          phone,
          total_price: totalPrice,
        },
        {
          headers: {
            "Content-Type": "application/json"   // ← Bổ sung đúng chỗ này là xong!
          }
        }
      );
      const data = res.data;
      setLoading(false);
      if (onSuccess) onSuccess(data);
      alert("Tạo đơn hàng thành công!");
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm">Tên người nhận</label>
        <input required value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm">Địa chỉ</label>
        <input required value={address} onChange={(e) => setAddress(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div>
        <label className="block text-sm">Số điện thoại</label>
        <input required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border rounded" />
      </div>
      <div className="text-right font-semibold">
        Tổng tiền: {totalPrice} VNĐ
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button disabled={loading} className="bg-orange-500 text-white px-4 py-2 rounded">
        {loading ? "Đang xử lý..." : "Đặt hàng"}
      </button>
    </form>
  );
}