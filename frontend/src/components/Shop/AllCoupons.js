import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { RxCross1 } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '~/layouts/Loader/Loader';
import { deleteProduct } from '~/redux/actions/Product';
import { server } from '~/server';
import styles from '~/styles/styles';

function AllCoupons() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [value, setValue] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const { products } = useSelector((state) => state.products);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${server}/coupon/get-coupon/${seller._id}`, {
        withCredentials: true,
      })
      .then((res) => {
        setIsLoading(false);
        // tuy data dc lay tu id cua seller nhung ma seller truong hop nay lai nam trong couponCode data nen ta phai data.couponCodes
        setCoupons(res.data.couponCodes);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [dispatch]);

  // delete product
  const handleDelete = (id) => {
    axios
      .delete(`${server}/coupon/delete-coupon/${id}`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success('Coupon code deleted succesfully!');
      });
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios
      .post(
        `${server}/coupon/create-coupon-code`,
        {
          name,
          minAmount,
          maxAmount,
          selectedProducts,
          value,
          shopId: seller._id,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success('Coupon code created successfully!');
        setOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  // ten cac cot trong data grid
  const columns = [
    {
      field: 'id',
      headerName: 'Coupon Id',
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: 'price',
      headerName: 'Value',
      minWidth: 100,
      flex: 0.6,
    },

    {
      field: 'Delete',
      flex: 0.8,
      minWidth: 120,
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {/* lay id params coupon hien tai vao doi so de xu ly dispatch dua ve backend */}
            {/* lay id tu field roi dua vao doi so */}
            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  // ten bien duoc gan phai trung` vs ten filed trong cot de dua ra bang gridview
  const row = [];
  coupons &&
    coupons.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: item.value + ' %',
      });
    });

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <div className="w-full flex justify-end">
            <div
              className={`${styles.button} !w-max !h-[45px] px-3 !rounded-[5px] mr-3 mb-3`}
              onClick={() => setOpen(true)}
            >
              <span className="text-white">Create Coupon Code</span>
            </div>
          </div>
          <DataGrid rows={row} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
          {open && (
            <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[2000] flex items-center justify-center">
              <div className="w-[90%] 800px:w-[40%] h-[80vh] bg-white rounded-md shadow p-4">
                <div className="w-full flex justify-end">
                  <RxCross1 size={30} className="cursor-pointer" onClick={() => setOpen(false)} />
                </div>
                <h5 className="text-[30px] font-Poppins text-center">Create Coupon Code</h5>
                {/* create counpon Code */}
                <form onSubmit={handleSubmit} aria-required={true}>
                  <br />

                  <div>
                    <label className="pb-2">
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
                      placeholder="Enter your coupon code name..."
                    />
                  </div>

                  <br />

                  <div>
                    <label className="pb-2">
                      Discount Percentenge <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="value"
                      required
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
                      placeholder="Enter your coupon code value..."
                    />
                  </div>

                  <br />

                  <div>
                    <label className="pb-2">Min Amount</label>
                    <input
                      type="number"
                      name="value"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
                      placeholder="Enter your coupon code min amount ..."
                    />
                  </div>

                  <br />

                  <div>
                    <label className="pb-2">Max Amount</label>
                    <input
                      type="number"
                      name="value"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
                      placeholder="Enter your coupon code max amount ..."
                    />
                  </div>

                  <br />

                  <div>
                    <label className="pb-2">Selected Product</label>
                    <select
                      className="w-full mt-2 border h-[35px] rounded-[5px]"
                      value={selectedProducts}
                      onChange={(e) => setSelectedProducts(e.target.value)}
                    >
                      <option value="Choose your selected products">
                        Choose your selected products
                      </option>
                      {products &&
                        products.map((i) => (
                          <option value={i.name} key={i.name}>
                            {i.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <br />

                  <div>
                    <input
                      type="submit"
                      value="Create"
                      className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
                    />
                  </div>

                  <br />
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default AllCoupons;
