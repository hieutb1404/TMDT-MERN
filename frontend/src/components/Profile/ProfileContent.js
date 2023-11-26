import { useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
// thu vien datagrid .. thu vien nay dung de phan trang , tim kiem ......
import { DataGrid } from '@material-ui/data-grid';
import { Link } from 'react-router-dom';
import { backend_url, server } from '~/server';
import { Button } from '@material-ui/core';
import styles from '~/styles/styles';
import { MdOutlineTrackChanges, MdTrackChanges } from 'react-icons/md';
import {
  deleteUserAddress,
  loadUser,
  updateUserAddress,
  updateUserInfomation,
} from '~/redux/actions/User';
import { toast } from 'react-toastify';
import axios from 'axios';
import { RxCross1 } from 'react-icons/rx';
// thu vien lay ra quoc gia tren the gioi
import { Country, State, City } from 'country-state-city';
import { getAllOrdersOfUser } from '~/redux/actions/Order';

// ProfilePage
function ProfileContent({ active }) {
  const { user, error, successMessage } = useSelector((state) => state.user);
  //user && user.name: Đây là một biểu thức điều kiện. Nó kiểm tra xem biến user có tồn tại và có thuộc tính name không. Nếu cả hai điều kiện này đều đúng, biểu thức sẽ trả về giá trị của user.name, nếu không nó sẽ trả về giá trị false.
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  // neu co du lieu phone thi hien ko thi ko hien
  const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: 'clearErrors' });
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch({ type: 'clearMessages' });
    }
  }, [error, successMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // bam click thi bat dau kich hoat dispatch updateUserInfomation action dua du lieu vao
    // truyen doi so dung thu tu tham so truyen vao truoc do
    dispatch(updateUserInfomation(name, email, phoneNumber, password));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    setAvatar(file);

    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    await axios
      .put(`${server}/user/update-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
      .then((response) => {
        dispatch(loadUser());
        toast.success('avatar update successfully!');
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  return (
    <div className="w-full">
      {/* profile */}
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              {/* (?.) là một tính năng của JavaScript cho phép bạn truy cập vào các thuộc tính của một đối tượng mà có thể không tồn tại, mà không gây ra lỗi. Nếu thuộc tính đó không tồn tại, thì kết quả của biểu thức sẽ là undefined. */}
              {/*  sử dụng user?.avatar trong biểu thức src của thẻ img, nó sẽ kiểm tra nếu user tồn tại và có thuộc tính avatar thì sẽ sử dụng đường dẫn hình ảnh từ avatar. Nếu không tồn tại, nó sẽ trả về undefined, và src sẽ không được cung cấp. */}
              {/* Việc sử dụng Optional Chaining giúp tránh gây ra lỗi nếu thuộc tính không tồn tại, và là một cách an toàn để truy cập các thuộc tính của đối tượng trong JavaScript. */}
              <img
                src={`${backend_url}${user?.avatar}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt=""
              />

              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input type="file" id="image" className="hidden" onChange={handleImage} />
                <label htmlFor="image">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-5">
            <form onSubmit={handleSubmit} aria-required={true}>
              {/* group 1 */}
              <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Email Adrress</label>
                  <input
                    type="text"
                    className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              {/* group 2 */}
              <div className="w-full 800px:flex block pb-3">
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="number"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                {/* group 3 */}
                <div className="w-[100%] 800px:w-[50%]">
                  <label className="block pb-2">Enter your password</label>
                  <input
                    type="password"
                    className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              <input
                className={`w-[250px] h-[40px] border border-[#3a24db] text-center text-[#3a23db] rounded-[3px] mt-8 cursor-pointer`}
                required
                value="Update"
                type="submit"
              />
            </form>
          </div>
        </>
      )}

      {/* orders 2 */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}

      {/* Refunds 3 */}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}

      {/*track orders page */}
      {active === 5 && (
        <div>
          <TrackOrder />
        </div>
      )}

      {/*changpassword page */}
      {active === 6 && (
        <div>
          <ChangePassword />
        </div>
      )}

      {/*user address page */}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
}

const AllOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  // mảng chứa các đối tượng cấu hình cho mỗi cột trong thu vien DataGrid
  const columns = [
    //field: Đây là tên của trường dữ liệu tương ứng trong mảng dữ liệu mà minh cung cấp
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

    {
      field: 'status',
      //  Đây là nội dung hiển thị ở phần đầu của cột, thường là tên mô tả cột.
      headerName: 'Status',
      // Đây là chiều rộng tối thiểu của cột, tính bằng pixel.
      minWidth: 130,
      // Đây là giá trị tương ứng với thuộc tính flex của CSS. Nó xác định tỷ lệ mà cột này chiếm trong không gian ngang của DataGrid.
      flex: 0.7,
      // cellClassName: Đây là một hàm callback cho phép bạn cung cấp các lớp CSS cho các ô dữ liệu trong cột.
      // Trong trường hợp này, hàm này dựa trên giá trị của trường 'status' để xác định xem ô dữ liệu nên có lớp CSS greenColor hay redColor. Điều này cho phép bạn tạo các hiệu ứng màu sắc khác nhau cho các ô dựa trên giá trị của trường.
      cellClassName: (params) => {
        return params.getValue(params.id, 'status') === 'Delivered' ? 'greenColor' : 'redColor';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: ' ',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        // ten bien gan' moi phai duoc trung` ten voi field trong bien' columns o tren thi gia tri hien vao no moi di dung thu tu cot
        id: item._id,
        itemsQty: item.cart.length,
        total: 'US$ ' + item.totalPrice,
        status: item.status,
      });
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid rows={row} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
    </div>
  );
};

const AllRefundOrders = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  // dat chuan
  const eligibleOrders =
    orders &&
    orders.filter(
      (item) => item.status === 'Processing refund' || item.status === 'Refund Success',
    );

  // mảng chứa các đối tượng cấu hình cho mỗi cột trong thu vien DataGrid
  const columns = [
    //field: Đây là tên của trường dữ liệu tương ứng trong mảng dữ liệu mà minh cung cấp
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

    {
      field: 'status',
      //  Đây là nội dung hiển thị ở phần đầu của cột, thường là tên mô tả cột.
      headerName: 'Status',
      // Đây là chiều rộng tối thiểu của cột, tính bằng pixel.
      minWidth: 130,
      // Đây là giá trị tương ứng với thuộc tính flex của CSS. Nó xác định tỷ lệ mà cột này chiếm trong không gian ngang của DataGrid.
      flex: 0.7,
      // cellClassName: Đây là một hàm callback cho phép bạn cung cấp các lớp CSS cho các ô dữ liệu trong cột.
      // Trong trường hợp này, hàm này dựa trên giá trị của trường 'status' để xác định xem ô dữ liệu nên có lớp CSS greenColor hay redColor. Điều này cho phép bạn tạo các hiệu ứng màu sắc khác nhau cho các ô dựa trên giá trị của trường.
      cellClassName: (params) => {
        return params.getValue(params.id, 'status') === 'Delivered' ? 'greenColor' : 'redColor';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: ' ',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  eligibleOrders &&
    eligibleOrders.forEach((item) => {
      row.push({
        // ten bien gan' moi phai duoc trung` ten voi field trong bien' columns o tren thi gia tri hien vao no moi di dung thu tu cot
        id: item._id,
        itemsQty: item.cart.length,
        total: 'US$ ' + item.totalPrice,
        status: item.status,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <DataGrid rows={row} columns={columns} pageSize={10} autoHeight disableSelectionOnClick />
    </div>
  );
};

const TrackOrder = () => {
  const { user } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, []);

  // mảng chứa các đối tượng cấu hình cho mỗi cột trong thu vien DataGrid
  const columns = [
    //field: Đây là tên của trường dữ liệu tương ứng trong mảng dữ liệu mà minh cung cấp
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

    {
      field: 'status',
      //  Đây là nội dung hiển thị ở phần đầu của cột, thường là tên mô tả cột.
      headerName: 'Status',
      // Đây là chiều rộng tối thiểu của cột, tính bằng pixel.
      minWidth: 130,
      // Đây là giá trị tương ứng với thuộc tính flex của CSS. Nó xác định tỷ lệ mà cột này chiếm trong không gian ngang của DataGrid.
      flex: 0.7,
      // cellClassName: Đây là một hàm callback cho phép bạn cung cấp các lớp CSS cho các ô dữ liệu trong cột.
      // Trong trường hợp này, hàm này dựa trên giá trị của trường 'status' để xác định xem ô dữ liệu nên có lớp CSS greenColor hay redColor. Điều này cho phép bạn tạo các hiệu ứng màu sắc khác nhau cho các ô dựa trên giá trị của trường.
      cellClassName: (params) => {
        return params.getValue(params.id, 'status') === 'Delivered' ? 'greenColor' : 'redColor';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: ' ',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/user/track/order/${params.id}`}>
              <Button>
                <MdTrackChanges size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        // ten bien gan' moi phai duoc trung` ten voi field trong bien' columns o tren thi gia tri hien vao no moi di dung thu tu cot
        id: item._id,
        itemsQty: item.cart.length,
        total: 'US$ ' + item.totalPrice,
        status: item.status,
      });
    });
  return (
    <div className="pl-8 pt-1">
      <DataGrid rows={row} columns={columns} pageSize={10} autoHeight disableSelectionOnClick />
    </div>
  );
};

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const passwordChangeHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/user/update-user-password`,
        { oldPassword, newPassword, confirmPassword },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success(res.data.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      });
  };
  return (
    <div className="w-full px-5">
      <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2 text-center block">
        Change Password
      </h1>
      <div className="w-full">
        <form aria-required onSubmit={passwordChangeHandler} className="flex flex-col items-center">
          <div className="w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your old password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>

          <div className="w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your new password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="w-[100%] 800px:w-[50%] mt-5">
            <label className="block pb-2">Enter your confirm password</label>
            <input
              type="password"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <input
              className={`w-[95%] h-[40px] border border-[#3a24db] text-center text-[#3a23db] rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

const Address = () => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [addressType, setAddressType] = useState('');
  const { user } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const addressTypeData = [
    {
      name: 'Default',
    },
    {
      name: 'Home',
    },
    {
      name: 'Office',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (addressType === '' || country === '' || city === '') {
      toast.error('Please fill all the fields!');
    } else {
      dispatch(updateUserAddress(country, city, address1, address2, zipCode, addressType));
      setOpen(false);
      setCountry('');
      setCity('');
      setAddress1('');
      setAddress2('');
      setZipCode(null);
      setAddressType('');
    }
  };

  const handleDelete = (item) => {
    const id = item._id;

    dispatch(deleteUserAddress(id));
  };

  return (
    <div className="w-full px-5">
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center ">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative orverflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1 size={30} className="cursor-pointer" onClick={() => setOpen(false)} />
            </div>
            <h1 className="text-center text-[25px] font-Poppins">Add New Address</h1>
            <div className="w-full">
              <form aria-required onSubmit={handleSubmit} className="w-full">
                <div className="w-full block p-4">
                  <div className="w-full pb-2">
                    <label className="block pb-2">Country</label>
                    <select
                      className="w-[95%] border h-[40px] rounded-[5px]"
                      name=""
                      id=""
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    >
                      <option value="" className="block border pb-2">
                        choose your country
                      </option>
                      {/* Country thu vien lay ra quoc gia tren the gioi */}
                      {Country &&
                        Country.getAllCountries().map((item) => (
                          <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Choose your city</label>
                    <select
                      className="w-[95%] border h-[40px] rounded-[5px]"
                      name=""
                      id=""
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="" className="block border pb-2">
                        choose your city
                      </option>
                      {/* chon thanh pho dua vao select country useState o tren da chon */}
                      {State &&
                        State.getStatesOfCountry(country).map((item) => (
                          <option className="block pb-2" key={item.isoCode} value={item.isoCode}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 1</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address1}
                      onChange={(e) => setAddress1(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address 2</label>
                    <input
                      type="address"
                      className={`${styles.input}`}
                      required
                      value={address2}
                      onChange={(e) => setAddress2(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Zip Code</label>
                    <input
                      type="number"
                      className={`${styles.input}`}
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                    />
                  </div>

                  <div className="w-full pb-2">
                    <label className="block pb-2">Address Type</label>
                    <select
                      className="w-[95%] border h-[40px] rounded-[5px]"
                      name=""
                      id=""
                      value={addressType}
                      onChange={(e) => setAddressType(e.target.value)}
                    >
                      <option value="" className="block border pb-2">
                        Choose your Address Type
                      </option>
                      {/* chon thanh pho dua vao select country useState o tren da chon */}
                      {addressTypeData &&
                        addressTypeData.map((item) => (
                          <option className="block pb-2" key={item.name} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="w-full pb-2">
                    <input
                      type="submit"
                      className={`${styles.input} mt-5 cursor-pointer`}
                      required
                      readOnly
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">My Addresses</h1>
        <div className={`${styles.button} !rounded-md`} onClick={() => setOpen(true)}>
          <span className="text-[#fff] ">Add New</span>
        </div>
      </div>
      <br />
      {user &&
        user.addresses.map((item, index) => (
          <div
            className="w-full bg-white h-min 800px:h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10 mb-5"
            key={index}
          >
            <div className="flex items-center">
              <h5 className="pl-5 font-[600]">{item.addressType}</h5>
            </div>
            <div className="pl-8 flex items-center">
              <h6>
                {item.address1} {item.address2}
              </h6>
            </div>
            <div className="pl-8 flex items-center">
              <h6>(84+) {user && user.phoneNumber}</h6>
            </div>
            <div className="min-w-[10%] flex items-center justify-between pl-8">
              <AiOutlineDelete
                size={25}
                className="cursor-pointer"
                onClick={() => handleDelete(item)}
              />
            </div>
          </div>
        ))}

      {user && user.addresses.length === 0 && (
        <h5 className="text-center pt-8 text-[18px]">You not have any saved address!</h5>
      )}
    </div>
  );
};

export default ProfileContent;
