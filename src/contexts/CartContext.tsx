// src/contexts/CartContext.tsx
import { createContext, useState, ReactNode, useContext } from 'react';
import { Product } from '../data/products';

// Mở rộng interface `Product` để thêm thuộc tính `quantity` cho các sản phẩm trong giỏ hàng
interface CartItem extends Product {
  quantity: number;
}

// Định nghĩa "hình dạng" (shape) của context, bao gồm state và các hàm sẽ được cung cấp
interface CartContextType {
  cart: CartItem[];                                  // Mảng chứa các sản phẩm trong giỏ hàng
  addToCart: (product: Product) => void;             // Hàm để thêm sản phẩm vào giỏ
  changeQuantity: (productId: string, delta: number) => void; // Hàm để thay đổi số lượng (tăng/giảm)
  removeItem: (productId: string) => void;           // Hàm để xóa một sản phẩm khỏi giỏ
  clearCart: () => void;                             // Hàm để xóa sạch giỏ hàng
  cartTotal: number;                                 // Tổng giá trị của giỏ hàng
}

// Tạo một Context mới với giá trị ban đầu là `undefined`
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Component Provider, có nhiệm vụ bao bọc các component khác
 * và cung cấp cho chúng quyền truy cập vào state và các hàm của giỏ hàng.
 * @param children - Các component con sẽ được bao bọc bởi Provider này.
 */
export const CartProvider = ({ children }: { children: ReactNode }) => {
  // Đây là state chính, lưu trữ một mảng các sản phẩm trong giỏ hàng
  const [cart, setCart] = useState<CartItem[]>([]);

  /**
   * Thêm một sản phẩm vào giỏ hàng.
   * Nếu sản phẩm đã tồn tại, chỉ tăng số lượng.
   * Nếu chưa, thêm sản phẩm mới vào giỏ với số lượng là 1.
   * @param product - Sản phẩm cần thêm.
   */
  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        // Nếu sản phẩm đã có, lặp qua mảng và chỉ cập nhật số lượng của sản phẩm đó
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Nếu là sản phẩm mới, thêm nó vào cuối mảng với số lượng là 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  /**
   * Thay đổi số lượng của một sản phẩm trong giỏ.
   * Tự động xóa sản phẩm nếu số lượng giảm xuống 0.
   * @param productId - ID của sản phẩm cần thay đổi.
   * @param delta - Lượng thay đổi (ví dụ: 1 để tăng, -1 để giảm).
   */
  const changeQuantity = (productId: string, delta: number) => {
    setCart(prevCart => {
      // Dùng map để tạo mảng mới với số lượng được cập nhật, sau đó dùng filter để loại bỏ sản phẩm có quantity <= 0
      return prevCart
        .map(item =>
          item.id === productId ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter(item => item.quantity > 0);
    });
  };

  /**
   * Xóa hoàn toàn một sản phẩm khỏi giỏ hàng, bất kể số lượng.
   * @param productId - ID của sản phẩm cần xóa.
   */
  const removeItem = (productId: string) => {
    // Lọc ra tất cả các sản phẩm không trùng với ID được cung cấp
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  /**
   * Xóa sạch tất cả sản phẩm trong giỏ hàng.
   * Thường được gọi sau khi thanh toán thành công.
   */
  const clearCart = () => {
    setCart([]); // Reset state về một mảng rỗng
  };
    
  // Tính toán tổng giá trị của giỏ hàng mỗi khi state `cart` thay đổi
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Cung cấp state và các hàm cho tất cả các component con
  return (
    <CartContext.Provider value={{ cart, addToCart, changeQuantity, removeItem, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

/**
 * Hook tùy chỉnh (custom hook) để giúp các component khác truy cập
 * vào CartContext một cách dễ dàng và an toàn hơn.
 */
export const useCart = () => {
  const context = useContext(CartContext);
  // Kiểm tra để đảm bảo hook này chỉ được sử dụng bên trong một CartProvider
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};