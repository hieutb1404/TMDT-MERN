import axios from 'axios';
import { server } from '~/server';

//load user
// loadUser là một hàm action creator được sử dụng để tải thông tin người dùng từ server.
export const loadUser = () => async (dispatch) => {
  try {
    dispatch({
      type: 'loadUserRequest',
    });
    // vì ở đây dùng phương thức get api nên nó sẽ nhận dữ liệu, logic từ server lên đưa vào biến {data} để xử lý
    const { data } = await axios.get(`${server}/user/getUser`, {
      withCredentials: true,
    });
    // dispatch dữ liệu về để xử lý với kiểu là loadUserSuccess, khi dữ liệu về, hàm nào thuộc type đó thì phần dữ liệu bên ngoài sẽ đi đúng vào hàm đó đó
    dispatch({
      // user o day lay tu databse
      type: 'loadUserSuccess',
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: 'loadUserFail',
      payload: error.response.data.message,
    });
  }
};

//load seller
// loadSeller là một hàm action creator được sử dụng để tải thông tin người dùng từ server.
export const loadSeller = () => async (dispatch) => {
  try {
    dispatch({
      type: 'loadSellerRequest',
    });
    // vì ở đây dùng phương thức get api nên nó sẽ nhận dữ liệu, logic từ server lên đưa vào biến {data} để xử lý
    const { data } = await axios.get(`${server}/shop/getSeller`, {
      withCredentials: true,
    });
    // dispatch dữ liệu về để xử lý với kiểu là loadUserSuccess, khi dữ liệu về, hàm nào thuộc type đó thì phần dữ liệu bên ngoài sẽ đi đúng vào hàm đó đó
    dispatch({
      // user o day lay tu databse
      type: 'loadSellerSuccess',
      payload: data.seller,
    });
  } catch (error) {
    dispatch({
      type: 'loadSellerFail',
      payload: error.response.data.message,
    });
  }
};

// user update infomation
// truyen tham so dung thu tu doi so truyen vao
export const updateUserInfomation = (name, email, phoneNumber, password) => async (dispatch) => {
  try {
    dispatch({
      type: 'updateUserInfomation',
    });
    const { data } = await axios.put(
      `${server}/user/update-user-info`,
      {
        email,
        password,
        phoneNumber,
        name,
      },
      { withCredentials: true },
    );
    dispatch({
      type: 'updateUserInfoSuccess',
      payload: data.user,
    });
  } catch (error) {
    dispatch({
      type: 'updateUserInfoFailed',
      payload: error.response.data.message,
    });
  }
};

// update user addresses
export const updateUserAddress =
  (country, city, address1, address2, zipCode, addressType) => async (dispatch) => {
    try {
      dispatch({
        type: 'updateUserAddressRequest',
      });
      const { data } = await axios.put(
        `${server}/user/update-user-addresses`,
        {
          country,
          city,
          address1,
          address2,
          zipCode,
          addressType,
        },
        { withCredentials: true },
      );
      dispatch({
        type: 'updateUserAddressSuccess',
        payload: {
          successMessage: 'User address update successfully!',
          user: data.user,
        },
      });
    } catch (error) {
      dispatch({
        type: 'updateUserAddressFailed',
        payload: error.response.data.message,
      });
    }
  };

// delete user address
export const deleteUserAddress = (id) => async (dispatch) => {
  try {
    dispatch({
      type: 'deleteUserAddressRequest',
    });

    const { data } = await axios.delete(`${server}/user/delete-user-address/${id}`, {
      withCredentials: true,
    });

    dispatch({
      type: 'deleteUserAddressSuccess',
      payload: {
        successMessage: 'User deleted successfully!',
        user: data.user,
      },
    });
  } catch (error) {
    dispatch({
      type: 'deleteUserAddressFailed',
      payload: error.response.data.message,
    });
  }
};
