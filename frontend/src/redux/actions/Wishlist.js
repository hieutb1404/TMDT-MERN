// add to cart
export const addToWishlist = (data) => async (dispatch, getState) => {
  dispatch({
    type: 'addToWishlist',
    payload: data,
  });

  // stringify dua du lieu ve dang JSON, vd: "name":"hieu", sau do dua qua reducers no se getItems dua ve dang javascript name:"hieu"
  localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlist));
  return data;
};

//remove from cart
export const removeFromWishlist = (data) => async (dispatch, getState) => {
  dispatch({
    type: 'removeFromWishlist',
    payload: data._id,
  });

  localStorage.setItem('wishlistItems', JSON.stringify(getState().wishlist.wishlist));
  return data;
};
