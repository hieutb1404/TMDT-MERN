import { useEffect, useState } from 'react';
import ProductCard from '../Route/ProductCard/ProductCard';
import { Link, useParams } from 'react-router-dom';
import styles from '~/styles/styles';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProductsShop } from '~/redux/actions/Product';
import { getAllEventsShop } from '~/redux/actions/Event';
import { backend_url } from '~/server';
import Ratings from '../Products/Ratings';

function ShopProfileData({ isOwner }) {
  const [active, setActive] = useState(1);
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [dispatch]);

  // flat loai bo tat ca mang long 2d - 1d, vd : [1,2,[3,4]] => [1,2,3,4]
  const allReviews = products && products.map((product) => product.reviews).flat();

  // Hàm này trả về chuỗi mô tả thời gian đã trôi qua giữa hiện tại và một thời điểm được cung cấp.
  const formatTimeAgo = (timestamp) => {
    const currentTimestamp = Date.now(); // Thời điểm hiện tại
    const commentTimestamp = new Date(timestamp).getTime(); // Thời điểm comment

    // Tính thời gian đã trôi qua
    const elapsedMilliseconds = currentTimestamp - commentTimestamp;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);
    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const elapsedHours = Math.floor(elapsedMinutes / 60);
    const elapsedDays = Math.floor(elapsedHours / 24);

    // Xác định và trả về thông điệp phù hợp
    if (elapsedDays > 0) {
      return `${elapsedDays} ngày trước`;
    } else if (elapsedHours > 0) {
      return `${elapsedHours} giờ trước`;
    } else if (elapsedMinutes > 0) {
      return `${elapsedMinutes} phút trước`;
    } else {
      return `${elapsedSeconds} giây trước`;
    }
  };

  let commentTimestamp;
  if (allReviews && allReviews.length > 0) {
    // Sắp xếp mảng theo thời điểm tạo giảm dần
    // allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    // // Gán thời điểm của đánh giá đầu tiên làm thời điểm mới nhất ban đầu
    // chuyển đổi thời điểm tạo của đánh giá đầu tiên thành timestamp (số mili giây từ Epoch) bằng cách sử dụng đối tượng Date
    commentTimestamp = new Date(allReviews[0].createdAt).getTime();
    //  // Lặp qua tất cả đánh giá để tìm thời điểm mới nhất
    allReviews.forEach((rev) => {
      // Đối với mỗi đánh giá, lấy thời điểm của nó và chuyển đổi thành timestamp.
      const reviewTimestamp = new Date(rev.createdAt).getTime();
      // Nếu thời điểm của đánh giá hiện tại lớn hơn commentTimestamp, cập nhật commentTimestamp với thời điểm mới nhất.
      // no se so sanh thoi gian dau tien khi duoc tao ra vs hien tai , neu lon hon no se thay the, vd: truoc do la 5 phut , moi nhat la 6 phut se thay the 5 thanh 6
      if (reviewTimestamp > commentTimestamp) {
        commentTimestamp = reviewTimestamp;
      }
    });
  }

  // Sử dụng hàm trong việc hiển thị thời gian
  // Thời điểm comment (định dạng ISO 8601)
  const formattedTimeAgo = formatTimeAgo(commentTimestamp);

  return (
    <div className="w-full">
      <div className="flex w-full items-center justify-between">
        <div className="w-full flex">
          <div className="flex items-center" onClick={() => setActive(1)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 1 ? 'text-red-500' : 'text-[#333]'
              } cursor-pointer pr-[20px]`}
            >
              Shop Products
            </h5>
          </div>

          <div className="flex items-center" onClick={() => setActive(2)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 2 ? 'text-red-500' : 'text-[#333]'
              } cursor-pointer pr-[20px]`}
            >
              Running Events
            </h5>
          </div>

          <div className="flex items-center" onClick={() => setActive(3)}>
            <h5
              className={`font-[600] text-[20px] ${
                active === 3 ? 'text-red-500' : 'text-[#333]'
              } cursor-pointer pr-[20px]`}
            >
              Shop Reviews
            </h5>
          </div>
        </div>

        <div>
          {isOwner && (
            <div>
              <Link to="/dashboard">
                <div className={`${styles.button} !rounded-[4px] h-[42px]`}>
                  <span className="text-[#fff] ">Go Dashboard</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <br />
      {active === 1 && (
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
          {products &&
            products.map((i, index) => <ProductCard data={i} key={index} isShop={true} />)}
        </div>
      )}

      {active === 2 && (
        <div className="w-full">
          <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-3 lg:gap-[25px] xl:grid-cols-4 xl:gap-[20px] mb-12 border-0">
            {events &&
              events.map((i, index) => (
                <ProductCard data={i} key={index} isShop={true} isEvent={true} />
              ))}
          </div>
        </div>
      )}

      {active === 3 && (
        <div className="w-full">
          {allReviews &&
            allReviews.map((item, index) => (
              <div className="w-full flex my-4">
                <img
                  src={`${backend_url}/${item.user.avatar}`}
                  className="w-[50px] h-[50px] rounded-full"
                  alt=""
                />
                <div className="pl-2">
                  <div className="flex w-full item-center">
                    <h1 className="font-[600] pr-2">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p className="font-[400] text-[#000000a7]">{item?.comment}</p>
                  {/* <p className="text-[#000000a7] text-[14px]">{formattedTimeAgo}</p> */}
                </div>
              </div>
            ))}
        </div>
      )}

      {products && products.length === 0 && (
        <h5 className="w-full text-center py-5 text-[18px]">No Products have for this shop!</h5>
      )}
    </div>
  );
}

export default ShopProfileData;
