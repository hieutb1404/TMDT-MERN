import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  // ban đầu cho xác thực người dùng = false
  isLoading: true,
};
// payload sẽ chứa dữ liệu của thằng action
// khi dispatch bên ngoài nó sẽ đưa dữ liệu vào action nhưng chứa dữ liệu sẽ là payload(action -> payload(data))
// dispatch vs action tương đương là 1 kiểu chỉ là kiểu loại , và lấy dữ liệu
// còn chưa dữ liệu là payload

export const sellerReducer = createReducer(initialState, {
  //Hành động được gọi khi yêu cầu tải thông tin người dùng
  loadSellerRequest: (state) => {
    //để chỉ ra rằng quá trình tải đang diễn ra.
    state.isLoading = true;
  },
  //Hành động được gọi khi tải thông tin người dùng thành công
  loadSellerSuccess: (state, action) => {
    // state.isAuthenticated được thiết lập là true để chỉ ra rằng người dùng đã được xác thực
    // isSeller duoc lay ra tu shop ben backend, phan load user
    state.isSeller = true;
    // loading = false dừng lại quá trình tải đang diễn ra khi đã xác thực thành công
    state.isLoading = false;
    // và thông tin người dùng được gán cho state.Seller từ action.payload
    state.seller = action.payload;
  },
  // Hành động được gọi khi quá trình tải thông tin người dùng gặp lỗi.
  loadSellerFail: (state, action) => {
    state.isLoading = false;
    // state.error được gán bằng action.payload (lỗi được truyền trong action)
    state.error = action.payload;
    // state.isAuthenticated được đặt lại thành false để chỉ ra rằng người dùng chưa được xác thực.
    state.isSeller = false;
  },
  // Hành động được gọi để xóa lỗi.
  clearError: (state, action) => {
    // state.error được đặt thành null để xóa thông báo lỗi hiện tại.
    state.error = null;
  },
  //get all sellers --admin
  getAllSellersRequest: (state) => {
    state.isLoading = true;
  },
  getAllSellersSuccess: (state, action) => {
    state.isLoading = true;
    state.sellers = action.payload;
  },
  getAllSellersFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },
});
