import React, { useState } from "react";

const API_BASE = "http://localhost:8000";

function AuthModal({ toggleAuth, showNotification, handleLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const url = isLogin ? `${API_BASE}/auth/login` : `${API_BASE}/auth/register`;

      const body = isLogin
        ? { username: formData.username, password: formData.password }
        : {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          };

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error("Không thể kết nối ");
      }

      if (!res.ok) {
        throw new Error(data.detail || (isLogin ? "Sai tài khoản hoặc mật khẩu" : "Đăng ký thất bại"));
      }

      if (!isLogin) {
        showNotification("Đăng ký thành công! Giờ hãy đăng nhập");
        setIsLogin(true);
        setFormData({ ...formData, email: "", password: "" });
        return;
      }

      // Đăng nhập thành công
      const isAdmin = data.is_admin === 1 || data.is_admin === true;
      handleLogin(formData.username, data.token, isAdmin);

      showNotification(`Chào mừng ${formData.username}!`);
      toggleAuth();

    } catch (err) {
      showNotification("Lỗi: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={toggleAuth}>
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{isLogin ? "Đăng nhập" : "Đăng ký"}</h2>
          <button onClick={toggleAuth} className="text-3xl text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <div className="flex mb-6 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 font-bold transition ${isLogin ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 font-bold transition ${!isLogin ? 'bg-orange-500 text-white' : 'bg-gray-200'}`}
          >
            Đăng ký
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          )}

          <input
            type="text"
            name="username"
            placeholder="Tên người dùng"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            name="password"
            placeholder="Mật khẩu"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-5 py-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold hover:bg-orange-600 disabled:opacity-70"
          >
            {loading ? "Đang xử lý..." : isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-500 font-bold hover:underline"
          >
            {isLogin ? "Đăng ký ngay" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthModal;