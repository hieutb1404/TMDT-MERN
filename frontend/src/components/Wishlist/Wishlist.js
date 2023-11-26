import { useEffect, useRef, useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { IoBagHandleOutline } from 'react-icons/io5';
import { BsCartPlus } from 'react-icons/bs';
import { HiOutlineMinus, HiPlus } from 'react-icons/hi';

import styles from '~/styles/styles';
import { Link } from 'react-router-dom';
import { AiOutlineHeart } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromWishlist } from '~/redux/actions/Wishlist';
import { backend_url } from '~/server';
import { addToCart } from '~/redux/actions/Cart';
import { toast } from 'react-toastify';

// props header
function Wishlist({ openWishList }) {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng hay chưa bằng cách so sánh thông tin sản phẩm
    const isProductInCart = cart.some((item) => item.id === data.id);

    if (isProductInCart) {
      // Nếu sản phẩm đã có trong giỏ hàng, bạn có thể hiển thị thông báo
      toast.error('Sản phẩm này đã có trong giỏ hàng.');

      // Hoặc thực hiện một hành động khác tùy thuộc vào yêu cầu của bạn
      // Ví dụ: tăng số lượng sản phẩm trong giỏ hàng thay vì thêm mới
    } else {
      // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào giỏ hàng
      const newData = { ...data, qty: 1 };
      dispatch(addToCart(newData));
      openWishList(false);
    }
  };

  const openCartRef = useRef(null);
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  const handleClickOutside = (event) => {
    if (openCartRef.current && !openCartRef.current.contains(event.target)) {
      openWishList(false);
    }
  };
  const cartData = [
    {
      name: 'Iphone 14 pro max 256 gb and 8gb ram sliver colour',
      description: 'test',
      price: 999,
    },
    {
      name: 'Iphone 14 pro max 256 gb and 8gb ram sliver colour',
      description: 'test',
      price: 645,
    },
  ];

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div
        className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between"
        ref={openCartRef}
      >
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items items-center justify-center">
            <div class="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1 size={25} className="cursor-pointer" onClick={() => openWishList(false)} />
            </div>
            <h5>Cart Items empty!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => openWishList(false)}
                />
              </div>
              {/* items length */}
              <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">{wishlist && wishlist.length} items</h5>
              </div>
              {/* Cart Single Items*/}
              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <RxCross1 className="cursor-pointer" onClick={() => removeFromWishlistHandler(data)} />
        <img
          src={`${backend_url}${data?.images[0]}`}
          className="w-[130px] h-min ml-2 mr-2 rounded-[5px]"
          alt=""
        />

        <div className="pl-[5px]">
          <h1>{data.name}</h1>
          <h4 className="font-[600] text-[17px] pt-[3px] text-[#d02222] font-Roboto">
            US${totalPrice}
          </h4>
        </div>
        <div>
          <BsCartPlus
            size={20}
            className="cursor-pointer"
            title="Add to cart"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
