import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';
import { Product } from '../../data/products';

// --- CÁC HÀNH ĐỘNG BẤT ĐỒNG BỘ (ASYNCTHUNKS) ---

/**
 * AsyncThunk để lấy tất cả sản phẩm từ API.
 */
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await axiosClient.get('/products');
  return response.data;
});

/**
 * AsyncThunk để tìm kiếm sản phẩm dựa trên một chuỗi truy vấn.
 * @param searchTerm - Chuỗi ký tự để tìm kiếm.
 */
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (searchTerm: string) => {
    // json-server hỗ trợ tìm kiếm toàn văn bản qua query parameter `q`
    const response = await axiosClient.get(`/products?q=${searchTerm}`);
    return response.data;
  }
);

/**
 * AsyncThunk để xóa một sản phẩm dựa trên ID.
 * @param productId - ID của sản phẩm cần xóa.
 */
export const deleteProduct = createAsyncThunk('products/deleteProduct', async (productId: string) => {
  await axiosClient.delete(`/products/${productId}`);
  // Trả về ID của sản phẩm đã xóa để cập nhật lại UI một cách nhanh chóng
  return productId;
});

/**
 * AsyncThunk để thêm một sản phẩm mới.
 * @param newProduct - Đối tượng sản phẩm mới (chưa có ID).
 */
export const addProduct = createAsyncThunk(
  'products/addProduct',
  async (newProduct: Omit<Product, 'id'>) => {
    const response = await axiosClient.post('/products', newProduct);
    // Trả về đối tượng sản phẩm hoàn chỉnh (đã có ID do server tạo ra)
    return response.data;
  }
);

/**
 * AsyncThunk để cập nhật một sản phẩm đã có.
 * @param productToUpdate - Đối tượng sản phẩm với thông tin đã được cập nhật.
 */
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async (productToUpdate: Product) => {
    const response = await axiosClient.put(`/products/${productToUpdate.id}`, productToUpdate);
    return response.data;
  }
);

// --- ĐỊNH NGHĨA STATE VÀ SLICE ---

// Định nghĩa cấu trúc của state cho slice sản phẩm
interface ProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed'; // Trạng thái của việc gọi API
  error: string | null;
}

// Giá trị khởi tạo của state
const initialState: ProductState = {
  items: [],
  status: 'idle',
  error: null,
};

// Tạo slice bằng `createSlice`
const productSlice = createSlice({
  name: 'products',
  initialState,
  // reducers: Dùng cho các action đồng bộ (ở đây không có)
  reducers: {},
  // extraReducers: Xử lý các action được tạo từ bên ngoài, đặc biệt là các asyncThunk
  extraReducers: (builder) => {
    builder
      // Xử lý các trạng thái cho hành động fetchProducts
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading'; // Khi bắt đầu gọi API
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded'; // Khi gọi API thành công
        state.items = action.payload; // Cập nhật danh sách sản phẩm
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed'; // Khi gọi API thất bại
        state.error = action.error.message || 'Failed to fetch products';
      })
      
      // Xử lý các trạng thái cho hành động searchProducts
      .addCase(searchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload; // Cập nhật state `items` với kết quả tìm kiếm từ API
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to search products';
      })
      
      // Xử lý khi các action CRUD hoàn thành thành công
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        // Lọc bỏ sản phẩm đã xóa ra khỏi state `items`
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        // Thêm sản phẩm mới vào state `items`
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        // Tìm và cập nhật sản phẩm trong state `items`
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default productSlice.reducer;