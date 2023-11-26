import { useEffect, useRef, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { IoBagHandleOutline } from 'react-icons/io5';
import { HiOutlineMinus, HiPlus } from 'react-icons/hi';

import styles from '~/styles/styles';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { backend_url } from '~/server';
import { addToCart, removeFromCart } from '~/redux/actions/Cart';
import { toast } from 'react-toastify';

// props header
function Cart({ setOpenCart }) {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };
  // acc = bien tich luy so lan tinh
  // item= bien hien tai tinh so hien tai
  const totalPrice = cart.reduce((acc, item) => acc + item.qty * item.discountPrice, 0);

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data));
  };

  const openCartRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const handleClickOutside = (event) => {
    if (openCartRef.current && !openCartRef.current.contains(event.target)) {
      setOpenCart(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div
        className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between"
        ref={openCartRef}
      >
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items items-center justify-center">
            <div class="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
            </div>
            <h5>Cart Items empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1 size={25} className="cursor-pointer" onClick={() => setOpenCart(false)} />
              </div>
              {/* items length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">{cart && cart.length} items</h5>
              </div>
              {/* Cart Single Items*/}
              <br />
              <div className="w-full border-t">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      // truyen doi so vao 2 function nay bang cach dua vao prop va lay doi so tu data trong function CartSingle
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* checkout bottons */}
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px] `}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now (USD${totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  // tang so luong
  const increament = (data) => {
    // set lai gia tri cho value khi dc bam tang so luong
    // ...data lay ra ban sao data  va so luong vua luu + 1
    if (data.stock < value) {
      // so luong sp database ma nho hon so luong khi nguoi dung bam tang thi bao loi
      toast.error('Product stock limited!');
    } else {
      // useState không cập nhật biến ngay lập tức vì React sử dụng cơ chế gọi lại (reconciliation) để quản lý việc cập nhật trạng thái và render lại giao diện. Khi bạn gọi setValue(value + 1), React ghi nhận việc thay đổi trạng thái này và lên lịch cho một lần render lại (re-render).
      // Vì vậy, sau khi gọi setValue(value + 1), value không được cập nhật ngay lập tức, mà sẽ được cập nhật trong quá trình render lại của component
      // trang thai ghi nhan cap nhat
      setValue(value + 1);
      // nen o day ta phai value+1 vi no chua re-render 1 cach nhanh nhu the duoc
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
    // hoac co the lam theo cach sau tranh tinh trang chua cap nhat ma ta da~ goi value
    // const updatedValue = value + 1;
    // setValue(updatedValue);
    // const updateCartData = { ...data, qty: updatedValue };
  };

  /// giam so luong
  const decreament = (data) => {
    // lay gia tri tang so luong san pham dua vao day de tinh' so tien tong san pham
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <div>
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[25px] h-[25px] ${styles.noramlFlex} justify-center cursor-pointers`}
            onClick={() => increament(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="pl-[10px]">{data.qty}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[25px] h-[25px] flex items-center justify-center cursor-pointer"
            onClick={() => decreament(data)}
          >
            <HiOutlineMinus size={16} color="#7d879c" />
          </div>
        </div>
        <img
          src={`${backend_url}${data?.images[0]}`}
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
          alt=""
        />
        <div className="pl-[5px]">
          <h1>{data.name}</h1>
          <h4 className="font-[400] text-[15px] text-[#00000082]">
            ${data.discountPrice} * {value}
          </h4>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>
        {/* truyen doi so can xoa */}
        <RxCross1 className="cursor-pointer" onClick={() => removeFromCartHandler(data)} />
      </div>
    </div>
  );
};

export default Cart;
