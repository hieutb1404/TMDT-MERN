import { useEffect, useState } from 'react';
import {
  AiFillHeart,
  AiFillStar,
  AiOutlineEye,
  AiOutlineHeart,
  AiOutlineShoppingCart,
  AiOutlineStar,
} from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styles from '~/styles/styles';
import ProductDetailsCard from '../ProductDetailsCard/ProductDetailsCard';
import { backend_url } from '~/server';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '~/redux/actions/Wishlist';
import { toast } from 'react-toastify';
import { addToCart } from '~/redux/actions/Cart';
import Ratings from '~/components/Products/Ratings';

function ProductCard({ data, isEvent }) {
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const [click, setClick] = useState(false);
  const [open, setOpen] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    if (wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist]);

  const d = data.name;
  const product_name = d.replace(/\s+/g, '-');

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = () => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    // neu san pham da ton tai thi thong bao da ton tai
    if (isItemExists) {
      toast.error('Item already exists');
    } else {
      // neu so luong san pham trong kho ma nho hon so luong mua hang thi bao loi hang ko du san pham
      if (data.stock < 1) {
        toast.error('Product stock limited!');
      } else {
        // nguoc lai neu chua ton tai thi tao ban sao data va qty dua const cartData
        // count o day t doi thanh 1 ten khac la qty: truoc khi dua vao du lieu, vao` du lieu count se dc toi ten la qty
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success('Item added to cart successfully!');
      }
    }
  };

  return (
    <div className="w-full  h-[370px] bg-white rounded-lg shasdow-sm p-3 relative cursor-pointer">
      <div className="flex justify-end"></div>
      <Link
        to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
      >
        <img
          src={`${backend_url}${data.images && data.images[0]}`}
          alt=""
          className="w-full h-[170px] object-contain "
        />
      </Link>
      <Link to={`/shop/preview/${data?.shop._id}`}>
        <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
      </Link>
      <Link
        to={`${isEvent === true ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}
      >
        <h4 className="pb-3 font-[500px] ">
          {/* nếu data.name mà có ký tự chữ lớn hơn 40 từ cắt từ 0 đến 40 và các chứ sau 40 sẽ thành 3 chấm, ngược lại nhỏ hơn 40 thì giữ nguyên data.name */}
          {data.name.length > 40 ? data.name.slice(0, 40) + '...' : data.name}
        </h4>

        <div className="flex">
          <Ratings rating={data?.ratings} />
        </div>

        <div className="py-2 flex items-center justify-between">
          <div className="flex">
            <h5 className={`${styles.productDiscountPrice}`}>
              {data.originalPrice === 0 ? data.originalPrice : data.discountPrice}
            </h5>
            <h4 className={`${styles.price}`}>
              {data.originalPrice ? data.originalPrice + '$' : null}
            </h4>
          </div>
          <span className="font-[400] text-[17px] text-[#68d284]">{data?.sold_out} sold</span>
        </div>
      </Link>
      {/* side options icon*/}
      <div>
        {click ? (
          <AiFillHeart
            size={20}
            className="cursor-pointer absolute right-2 top-5"
            onClick={() => removeFromWishlistHandler(data)}
            color={click ? 'red' : '#333'}
            title="Remove from wishlist"
          />
        ) : (
          <AiOutlineHeart
            size={22}
            className="cursor-pointer absolute right-2 top-5"
            onClick={() => addToWishlistHandler(data)}
            color={click ? 'red' : '#333'}
            title="Add from wishlist"
          />
        )}
        <AiOutlineEye
          size={20}
          className="cursor-pointer absolute right-2 top-14"
          onClick={() => setOpen(!open)}
          color="#333"
          title="Quick view"
        />
        <AiOutlineShoppingCart
          size={25}
          className="cursor-pointer absolute right-2 top-24"
          onClick={() => addToCartHandler(data._id)}
          color="#444"
          title="Add too cart"
        />

        {open ? <ProductDetailsCard setOpen={setOpen} data={data} /> : null}
      </div>
    </div>
  );
}

export default ProductCard;
