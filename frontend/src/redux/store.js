import { configureStore } from '@reduxjs/toolkit';
import { userReducer } from './reducers/user';
import { sellerReducer } from './reducers/seller';
import { productReducer } from './reducers/product';
import { eventReducer } from './reducers/event';
import { cartReducer } from './reducers/cart';
import { wishlistReducer } from './reducers/wishlist';
import { orderReducer } from './reducers/order';

//file app
// Khi bạn gọi Store.dispatch(loadUser()), action loadUser() sẽ được gửi đến reducer userReducer và reducer này sẽ thực hiện việc xử lý action ( sau khi userReducer xu ly xong se dua vao user).
// userReducer chịu trách nhiệm xử lý action loadUser(), có thể là để lấy dữ liệu người dùng từ server và cập nhật lại state của "user" trong Redux store. Sau khi reducer thực hiện xong, state của "user" trong Redux store sẽ được cập nhật theo kết quả xử lý của action loadUser().
// Store.dispatch(loadUser()), nó sẽ kích hoạt việc xử lý action và thay đổi state trong Redux store dựa trên reducer đã được cấu hình. Sau khi action được xử lý, bạn có thể sử dụng useSelector để lấy dữ liệu từ Redux store ra sử dụng trong các component.

// co the hieu 2 cach , 1: loadUser se di vao userReducer xu ly truoc roi gan vao user
// 2: loadUser se di vao user nhung gia tri gan vao user la userReducer nen van phai su ly trong userReducer
const Store = configureStore({
  reducer: {
    user: userReducer,
    seller: sellerReducer,
    products: productReducer,
    events: eventReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    order: orderReducer,
  },
});
// toan cuc
// Sau khi tạo store thành công, bạn export nó để sử dụng trong các component khác của ứng dụng. Điều này cho phép bạn sử dụng các hooks như useSelector và useDispatch để truy cập và cập nhật state trong Redux từ các component của ứng dụng.
export default Store;
