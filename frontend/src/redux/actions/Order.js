import axios from 'axios';
import { server } from '~/server';

// get all orders of user
export const getAllOrdersOfUser = (userId) => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllOrdersUserRequest',
    });
    const { data } = await axios.get(`${server}/order/get-all-orders/${userId}`);

    dispatch({
      type: 'getAllOrdersUsersSuccess',
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: 'getAllOrdersUsersFailed',
      patload: error.response.data.message,
    });
  }
};

// get all order of shop
export const getAllOrdersOfShop = (shopId) => async (dispatch) => {
  try {
    dispatch({
      type: 'getAllOrdersShopRequest',
    });
    const { data } = await axios.get(`${server}/order/get-seller-all-orders/${shopId}`);

    dispatch({
      type: 'getAllOrdersShopSuccess',
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: 'getAllOrdersShopFailed',
      patload: error.response.data.message,
    });
  }
};
// get all orders get of admin

export const getAllOrdersOfAdmin = () => async (dispatch) => {
  try {
    dispatch({
      type: 'adminAllOrdersRequest',
    });
    const { data } = await axios.get(`${server}/order/admin-all-orders`, { withCredentials: true });

    dispatch({
      type: 'adminAllOrdersShopSuccess',
      payload: data.orders,
    });
  } catch (error) {
    dispatch({
      type: 'adminAllOrdersShopFailed',
      patload: error.response.data.message,
    });
  }
};
