import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import { Product } from '../../data/products';

// Lấy tất cả sản phẩm từ API
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axiosClient.get('/products');
  return response.data;
});

// Xóa một sản phẩm dựa trên ID
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId: string) => {
  await axiosClient.delete(`/products/${productId}`);
  // Trả về ID của sản phẩm đã xóa để cập nhật lại UI
  return productId;
});

// Thêm một sản phẩm mới
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (newProduct: Omit<Product, 'id'>) => {
    const response = await axiosClient.post('/products', newProduct);
    // Trả về sản phẩm mới (bao gồm cả ID do server tạo ra)
    return response.data;
  }
);

// Cập nhật một sản phẩm đã có
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productToUpdate: Product) => {
    const response = await axiosClient.put(`/products/${productToUpdate.id}`, productToUpdate);
    return response.data;
  }
);

// Định nghĩa cấu trúc state cho slice sản phẩm
interface ProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Trạng thái của việc gọi API
  error: string | null;
}

// Trạng thái khởi tạo
const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  // Xử lý các trạng thái của asyncThunks
  extraReducers: (builder) => {
    builder
      // --- Xử lý cho fetchProducts ---
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'; // Khi đang gọi API
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded'; // Khi gọi API thành công
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'; // Khi gọi API thất bại
        state.error = action.error.message || 'Failed to fetch products';
      })

      // --- Xử lý cho các action CRUD khác ---
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        // Khi xóa thành công, lọc sản phẩm ra khỏi mảng `items`
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        // Khi thêm thành công, đẩy sản phẩm mới vào mảng `items`
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        // Khi cập nhật thành công, tìm và thay thế sản phẩm trong mảng `items`
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;