import React from 'react';

function CartSidebar({ isOpen, cart, toggleCart, removeFromCart, updateQuantity, openCheckout, showNotification }) {
  if (!isOpen) return null;

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed top-0 right-0 w-96 h-full bg-white shadow-2xl z-50 p-6 flex flex-col">
      <button onClick={toggleCart} className="self-end text-3xl font-bold text-gray-500 hover:text-gray-800">&times;</button>
      <h2 className="text-2xl font-bold mb-6">Giỏ hàng ({cart.length})</h2>

      {cart.length === 0 ? (
        <p className="text-gray-500 text-center mt-20 text-xl">Giỏ hàng trống</p>
      ) : (
        <>
          <div className="flex-grow overflow-y-auto space-y-4 pb-4">
            {cart.map(item => (
              <div key={`${item.id}-${item.size || ''}`} className="flex items-center p-4 border rounded-2xl bg-gray-50">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover mr-4" />
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  {item.size && <p className="text-sm text-gray-600">Size: {item.size}</p>}
                  <p className="text-orange-500 font-bold">{item.price.toLocaleString()}đ</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.size, -1)} className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300">-</button>
                    <span className="font-bold">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.size, 1)} className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300">+</button>
                    <button
                      onClick={() => {
                        removeFromCart(item.id, item.size);
                        showNotification('Đã xóa sản phẩm', 'success');
                      }}
                      className="ml-auto text-red-500 font-medium"
                    >Xóa</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4">
            <p className="text-right text-2xl font-bold text-orange-600 mb-4">
              Tổng: {totalAmount.toLocaleString()}đ
            </p>
            <button
              onClick={openCheckout}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-2xl font-bold text-xl hover:from-orange-600 hover:to-red-600 transition shadow-lg"
            >
              Thanh toán ngay
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartSidebar;