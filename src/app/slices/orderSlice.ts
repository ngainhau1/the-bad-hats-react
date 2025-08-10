import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

/**
 * AsyncThunk để lấy tất cả đơn hàng từ API.
 * Thường dùng cho trang quản lý của Admin.
 */
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
    const response = await axiosClient.get('/orders');
    return response.data;
});

// Định nghĩa cấu trúc và trạng thái khởi tạo cho slice đơn hàng
const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded'
    },
    reducers: {},
    // Xử lý các trạng thái của asyncThunk fetchOrders
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading'; // Khi đang gọi API
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Khi gọi API thành công
                state.items = action.payload;
            });
    },
});

export default orderSlice.reducer;