import { useEffect, useState } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineMessage, AiOutlineShopping } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addToCart } from '~/redux/actions/Cart';
import { getAllProductsShop } from '~/redux/actions/Product';
import { addToWishlist, removeFromWishlist } from '~/redux/actions/Wishlist';
import { backend_url, server } from '~/server';
import styles from '~/styles/styles';
import Ratings from './Ratings';
import axios from 'axios';

//productDetailsPage
function ProductDetails({ data }) {
  const { cart } = useSelector((state) => state.cart);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const { wishlist } = useSelector((state) => state.wishlist);
  const { products } = useSelector((state) => state.products);

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // data dc truyen props tu ProductDetailsPage la null nen la lam nhu sau
  // Ban đầu, data được khởi tạo là null vì nó chưa nhận được dữ liệu nào từ Redux store hoặc bất kỳ nguồn nào khác. Sau đó, khi bạn thêm data vào mảng phụ thuộc của useEffect, nó sẽ chờ cho data thay đổi trước khi chạy. Khi data thay đổi (tức là bạn đã tìm thấy dữ liệu từ Redux store và gán nó cho data), useEffect sẽ chạy lại và bạn có thể sử dụng data để thực hiện cuộc gọi dispatch. Điều này đảm bảo rằng bạn sẽ không gặp lỗi null khi truy cập data._id.
  useEffect(() => {
    if (data) {
      // lay san pham theo id shop,
      dispatch(getAllProductsShop(data && data?.shop._id));
      if (wishlist && wishlist.find((i) => i._id === data?._id)) {
        setClick(true);
      } else {
        setClick(false);
      }
    }
  }, [data, wishlist]);

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };
  const incrementCount = () => {
    setCount(count + 1);
  };

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
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success('Item added to cart successfully!');
      }
    }
  };

  const handleMassageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  const totalReviewsLength =
    products && products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0,
    );

  const averageRating = totalRatings / totalReviewsLength || 0;
  return (
    <div className="bg-white">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%] `}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${backend_url}${data && data.images[select]}`}
                  alt=""
                  className="w-[80%]"
                />
                <div className="w-full flex">
                  {data &&
                    data.images.map((i, index) => (
                      <div className={`${select === 0 ? 'border' : 'null'} cursor-pointer`}>
                        <img
                          src={`${backend_url}${i}`}
                          alt=""
                          className="h-[200px] overflow-hidden mr-3 mt-3"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* noi dung */}
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p>{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>{data.discountPrice}</h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + '$' : null}
                  </h3>
                </div>

                {/* increment vs descrement  */}
                <div className="flex items-center mt-12 justify-between pr-3">
                  <div>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-200 text-gray-800 font-medium px-4 py-[11px]">
                      {count}
                    </span>
                    <button
                      className="bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
                  {/* icon heart */}
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer "
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? 'red' : '#333'}
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={32}
                        className="cursor-pointer "
                        onClick={() => addToWishlistHandler(data)}
                        color={click ? 'red' : '#333'}
                        title="Add from wishlist"
                      />
                    )}
                  </div>
                </div>
                {/* add to cart */}

                <div
                  className={`${styles.button} !mt-6 rounded !h-11 flex items-center`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center">
                    Add to cart <AiOutlineShopping className="ml-1" />
                  </span>
                </div>

                {/* send mess */}

                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={`${backend_url}${data?.shop?.avatar}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>{data.shop.name}</h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">({averageRating}/5) Ratings</h5>
                  </div>

                  <div
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11`}
                    onClick={handleMassageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Send Message <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
          <br />
          <br />
        </div>
      ) : null}
    </div>
  );
}

const ProductDetailsInfo = ({ data, products, totalReviewsLength, averageRating }) => {
  const [active, setActive] = useState(1);

  console.log(products);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded ">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(1)}
          >
            Product Reviews
            {active === 1 ? <div className={`${styles.active_indicator}`}></div> : null}
          </h5>
        </div>

        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(2)}
          >
            Product Details
            {active === 2 ? <div className={`${styles.active_indicator}`}></div> : null}
          </h5>
        </div>

        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px]"
            onClick={() => setActive(3)}
          >
            Seller Infomation
            {active === 3 ? <div className={`${styles.active_indicator}`}></div> : null}
          </h5>
        </div>
      </div>

      {/* content  */}
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">{data.description}</p>
        </>
      ) : null}

      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3">
          {data &&
            data.reviews.map((item, index) => (
              <div className="w-full flex my-2">
                <img
                  src={`${backend_url}/${item.user.avatar}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full "
                />
                <div className="pl-2">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={item?.rating} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}
          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && <h5>No Reviews have for this product!</h5>}
          </div>
        </div>
      ) : null}
      {active === 3 ? (
        <div className="w-full block 800px:flex p-5">
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${backend_url}${data?.shop?.avatar}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-3">
                  <h3 className={`${styles.shop_name}`}>{data.shop.name}</h3>
                  <h5 className="pb-3 text-[15px]">({averageRating}/5) Ratings</h5>
                </div>
              </div>
            </Link>
            <p className="pt-2">{data.shop.description}</p>
          </div>

          <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
            <div className="text-left">
              <h5 className="font-[600]">
                Joined on: <span className="font-[500]">{data.shop?.createAt?.slice(0, 10)}</span>
              </h5>

              <h5 className="font-[600] pt-3">
                Total Products: <span className="font-[500]">{products && products.length}</span>
              </h5>

              <h5 className="font-[600] pt-3">
                Total Reviews: <span className="font-[500]">{totalReviewsLength}</span>
              </h5>

              <Link to="/">
                <div className={`${styles.button} rounded-[4px] h-[39.5px] mt-3`}>
                  <h4 className="text-white">Visit shop</h4>
                </div>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetails;
