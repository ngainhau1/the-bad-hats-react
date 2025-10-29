import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Kiểu đơn hàng tối giản (dùng any cho đơn giản nếu dữ liệu thay đổi)
export interface Order {
  id: string;
  status: string;
  [key: string]: any;
}

// Lấy tất cả đơn hàng
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const response = await axiosClient.get('/orders');
  return response.data as Order[];
});

// Cập nhật trạng thái đơn hàng theo id (PATCH tới json-server)
export const updateOrderStatus = createAsyncThunk(
  'orders/updateOrderStatus',
  async ({ id, status }: { id: string; status: string }) => {
    const response = await axiosClient.patch(`/orders/${id}`, { status });
    return response.data as Order;
  }
);

type OrdersState = {
  items: Order[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string | null;
};

const initialState: OrdersState = {
  items: [],
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch orders';
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        const updated = action.payload;
        const idx = state.items.findIndex((o) => o.id === updated.id);
        if (idx !== -1) state.items[idx] = updated;
      });
  },
});

export default orderSlice.reducer;

