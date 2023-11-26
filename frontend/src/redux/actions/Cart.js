// add to cart
export const addToCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: 'addToCart',
    payload: data,
  });

  // stringify dua du lieu ve dang JSON, vd: "name":"hieu", sau do dua qua reducers no se getItems dua ve dang javascript name:"hieu"
  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cart));
  return data;
};

//remove from cart
export const removeFromCart = (data) => async (dispatch, getState) => {
  dispatch({
    type: 'removeFromCart',
    payload: data._id,
  });

  localStorage.setItem('cartItems', JSON.stringify(getState().cart.cart));
  return data;
};
