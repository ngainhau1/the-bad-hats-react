import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosClient from '../../api/axiosClient';

// Định nghĩa kiểu dữ liệu cho một người dùng
interface User {
  id: number;
  email: string;
  role: 'admin' | 'user';
  fullName: string;
  password?: string;
}

// Định nghĩa cấu trúc state cho slice xác thực
interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
}

/**
 * AsyncThunk để xử lý logic đăng nhập.
 * - Gửi yêu cầu API để kiểm tra email và mật khẩu.
 * - Nếu thành công, trả về dữ liệu người dùng.
 * - Nếu thất bại, trả về một lỗi.
 */
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (loginData: Pick<User, 'email' | 'password'>, { rejectWithValue }) => {
    try {
      // Gọi API để tìm người dùng có email và password trùng khớp
      const response = await axiosClient.get(`/users?email=${loginData.email}&password=${loginData.password}`);
      // Nếu API trả về kết quả (mảng có phần tử), đăng nhập thành công
      if (response.data.length > 0) {
        return response.data[0];
      }
      // Nếu không, trả về lỗi
      return rejectWithValue('Email hoặc mật khẩu không chính xác.');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đã có lỗi xảy ra.');
    }
  }
);

/**
 * AsyncThunk để xử lý logic đăng ký người dùng mới.
 * - Kiểm tra xem email đã tồn tại hay chưa.
 * - Nếu chưa, tạo người dùng mới qua API.
 * - Nếu thành công, trả về dữ liệu người dùng mới.
 */
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (newUserData: Omit<User, 'id' | 'role'>, { rejectWithValue }) => {
    try {
      // 1. Kiểm tra email đã tồn tại chưa
      const checkEmailResponse = await axiosClient.get(`/users?email=${newUserData.email}`);
      if (checkEmailResponse.data.length > 0) {
        return rejectWithValue('Email này đã được sử dụng.');
      }
      
      // 2. Tạo người dùng mới với vai trò mặc định là 'user'
      const response = await axiosClient.post('/users', { ...newUserData, role: 'user' });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Đã có lỗi xảy ra khi đăng ký.');
    }
  }
);

// Trạng thái khởi tạo ban đầu cho slice
const initialState: AuthState = {
  isLoggedIn: false,
  currentUser: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  // Reducers: chứa các action đồng bộ (synchronous)
  reducers: {
    // Action này có thể được gọi để cập nhật state một cách trực tiếp
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoggedIn = true;
      state.currentUser = action.payload;
    },
    // Action để xử lý đăng xuất
    logout: (state) => {
      state.isLoggedIn = false;
      state.currentUser = null;
    },
  },
  // extraReducers: xử lý các action được tạo từ bên ngoài, đặc biệt là các asyncThunk
  extraReducers: (builder) => {
    builder
      // Xử lý khi action `registerUser` hoàn thành thành công
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        // Tự động đăng nhập cho người dùng sau khi đăng ký
        state.isLoggedIn = true;
        state.currentUser = action.payload;
      })
      // Xử lý khi action `loginUser` hoàn thành thành công
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoggedIn = true;
        state.currentUser = action.payload;
      });
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;