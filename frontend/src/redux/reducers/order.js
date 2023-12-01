import { createReducer } from '@reduxjs/toolkit';

const initialState = {
  isLoading: true,
};

export const orderReducer = createReducer(initialState, {
  // get all order of  user
  getAllOrdersUserRequest: (state) => {
    state.isLoading = true;
  },
  getAllOrdersUsersSuccess: (state, action) => {
    state.isLoading = false;
    state.orders = action.payload;
  },
  getAllOrdersUsersFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  //get all orders of shop
  getAllOrdersShopRequest: (state) => {
    state.isLoading = true;
  },
  getAllOrdersShopSuccess: (state, action) => {
    state.isLoading = false;
    state.orders = action.payload;
  },
  getAllOrdersShopFailed: (state, action) => {
    state.isLoading = false;
    state.error = action.payload;
  },

  // admin all order
  adminAllOrdersRequest: (state) => {
    state.adminOrderLoading = true;
  },
  adminAllOrdersShopSuccess: (state, action) => {
    state.adminOrderLoading = false;
    state.adminOrders = action.payload;
  },
  adminAllOrdersShopFailed: (state, action) => {
    state.adminOrderLoading = false;
    state.error = action.payload;
  },

  clearErrors: (state) => {
    state.error = null;
  },
});
