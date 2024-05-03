import styles from '~/styles/styles';
import CountDown from './CountDown';
import { backend_url } from '~/server';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { addToCart } from '~/redux/actions/Cart';

function EventCard({ active, data }) {
  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
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
        // 1 vi` de tranh bi trung`, con tang giam so luong thi phai vao truc tiep gio hang
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success('Item added to cart successfully!');
      }
    }
  };

  return (
    <div
    className={`w-full block bg-white rounded-lg ${
      active ? "unset" : "mb-12"
    } lg:flex p-2`}
  >
      <div className="w-full lg:w-[50%] m-auto">
        <img src={`${backend_url}${data && data.images[0]}`} alt="" />
      </div>

      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>{data ? data.name : ""}</h2>
        <p>{data ? data.description: ""}</p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              {data ? data.originalPrice : ""}$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">{data ? data.discountPrice : ""}$</h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">{data ? data.sold_out : ""} sold out</span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data ? data._id : ""}?isEvent=true`}>
            <div className={`${styles.button} text-[#fff]`}>See Details</div>
          </Link>
          <div
            className={`${styles.button} text-[#fff] ml-5`}
            onClick={(e) => addToCartHandler(data)}
          >
            Add to cart
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventCard;
