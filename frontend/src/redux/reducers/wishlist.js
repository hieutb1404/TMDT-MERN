import { createReducer } from '@reduxjs/toolkit';

const initalState = {
  // lưu trữ dữ liệu trong cơ sở dữ liệu cục bộ (localStorage) của trình duyệt web.
  // ktra du lieu co ton tai hay khong
  // Json.parse chuyen doi chuoi json json thanh kieu javascript(vi` du lieu dc luu o trinh duyet tra ve dang JSON nen ta phai doi sang dang javascript de dua vao database)
  // vd dang json : "name": "hieu"
  // vd javascript(json) dung xu ly du lieu : name: "hieu"
  wishlist: localStorage.getItem('wishlistItems')
    ? JSON.parse(localStorage.getItem('wishlistItems'))
    : [],
};

export const wishlistReducer = createReducer(initalState, {
  addToWishlist: (state, action) => {
    const item = action.payload;
    const isItemExists = state.wishlist.find((i) => i._id === item._id);
    // neu san pham ton tai trong gio hang roi thi tang len 1
    if (isItemExists) {
      return {
        // ...state o day la tao ra 1 ban sao moi va giu nguyen ban sao hien tai (du lieu cart)
        ...state,
        // thay thế sản phẩm đó bằng sản phẩm mới (item). Điều này đồng nghĩa với việc cập nhật số lượng hoặc thông tin liên quan đến sản phẩm.
        //cart: o day la 1 mang moi' ko lien quan den ban sao state.cart ma o tren da khai bao
        // state.cart duoc lay tu ban sao ben tren
        wishlist: state.cart.map((i) => (i._id === isItemExists._id ? item : i)),
      };
    } else {
      // nguoc lai chua co thi them vao gio hang
      return {
        ...state,
        // tạo một mảng mới (cart:) , sao chep tat ca du lieu trong gio hang hien tai, va them san pham moi vao
        // muc dich sao chep la de giu nguyen ven duoc san pham trong gio hang truoc' do' khi them moi 1 san pham khac vao, khi do them san pham moi se ko bi mat cac san pham da them truoc do
        wishlist: [...state.wishlist, item],
      };
    }
  },

  removeFromWishlist: (state, action) => {
    return {
      ...state,
      wishlist: state.wishlist.filter((i) => i._id !== action.payload),
    };
  },
});
