import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  // ban đầu cho xác thực người dùng = false
  isAuthenticated: false,
};
// payload sẽ chứa dữ liệu của thằng action
// khi dispatch bên ngoài nó sẽ đưa dữ liệu vào action nhưng chứa dữ liệu sẽ là payload(action -> payload(data))
// dispatch vs action tương đương là 1 kiểu chỉ là kiểu loại , và lấy dữ liệu
// còn chưa dữ liệu là payload

export const userReducer = createReducer(initialState, {
  //Hành động được gọi khi yêu cầu tải thông tin người dùng
  loadUserRequest: (state) => {
    //để chỉ ra rằng quá trình tải đang diễn ra.
    state.loading = true;
  },
  //Hành động được gọi khi tải thông tin người dùng thành công
  loadUserSuccess: (state, action) => {
    // state.isAuthenticated được thiết lập là true để chỉ ra rằng người dùng đã được xác thực
    state.isAuthenticated = true;
    // loading = false dừng lại quá trình tải đang diễn ra khi đã xác thực thành công
    state.loading = false;
    // và thông tin người dùng được gán cho state.user từ action.payload
    state.user = action.payload;
  },
  // Hành động được gọi khi quá trình tải thông tin người dùng gặp lỗi.
  loadUserFail: (state, action) => {
    state.loading = false;
    // state.error được gán bằng action.payload (lỗi được truyền trong action)
    state.error = action.payload;
    // state.isAuthenticated được đặt lại thành false để chỉ ra rằng người dùng chưa được xác thực.
    state.isAuthenticated = false;
  },
  //update user infomation
  updateUserInfomation: (state) => {
    state.loading = true;
  },
  updateUserInfoSuccess: (state, action) => {
    state.loading = false;
    state.user = action.payload;
  },
  updateUserInfoFailed: (state, action) => {
    state.loading = false;
    state.error = action.payload;
  },
  // update user address
  updateUserAddressRequest: (state) => {
    state.addressloading = true;
  },
  updateUserAddressSuccess: (state, action) => {
    state.addressloading = false;
    state.successMessage = action.payload.successMessage;
    state.user = action.payload.user;
  },
  updateUserAddressFailed: (state, action) => {
    state.addressloading = false;
    state.error = action.payload;
  },
  // delete user address
  deleteUserAddressRequest: (state) => {
    state.addressloading = true;
  },
  deleteUserAddressSuccess: (state, action) => {
    state.addressloading = false;
    state.successMessage = action.payload.successMessage;
    state.user = action.payload.user;
  },
  deleteUserAddressFailed: (state, action) => {
    state.addressloading = false;
    state.error = action.payload;
  },
  clearMessages: (state, action) => {
    // state.error được đặt thành null để xóa thông báo lỗi hiện tại.
    state.successMessage = null;
  },

  // get all users -- admin
  getAllUsersRequest: (state) => {
    state.usersLoading = true;
  },
  getAllUsersSuccess: (state, action) => {
    state.usersLoading = false;
    state.users = action.payload;
  },
  getAllUsersFailed: (state, action) => {
    state.usersLoading = false;
    state.error = action.payload;
  },

  // Hành động được gọi để xóa lỗi.
  clearError: (state, action) => {
    // state.error được đặt thành null để xóa thông báo lỗi hiện tại.
    state.error = null;
  },
});
