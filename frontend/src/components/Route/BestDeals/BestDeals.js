import { useEffect, useState } from 'react';
import styles from '~/styles/styles';
import ProductCard from '../ProductCard/ProductCard';
import { useSelector } from 'react-redux';

function BestDeals() {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    // Sử dụng sort để sắp xếp mảng productData dựa trên thuộc tính total_sell của mỗi sản phẩm. Phương thức sort sẽ so sánh các giá trị của thuộc tính total_sell của hai sản phẩm và sắp xếp chúng theo thứ tự tăng dần (sản phẩm có total_sell nhỏ hơn sẽ đứng trước).
    // Lấy ra 5 sản phẩm đầu tiên sau khi đã sắp xếp bằng cách sử dụng slice(0, 5). Phương thức slice sẽ cắt mảng d từ vị trí 0 đến vị trí 4 (tổng cộng 5 phần tử), lấy ra 5 sản phẩm đầu tiên trong mảng đã sắp xếp d.
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData?.sort((a, b) => b.sold_out - a.sold_out);
    const firstFive = sortedData && sortedData.slice(0, 5);
    setData(firstFive);
  }, [allProducts]);

  return (
    <div>
      <div className={`${styles.section}`}>
        <div className={`${styles.heading}`}>
          <h1>Best Deals</h1>
        </div>
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 ls-gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>
      </div>
    </div>
  );
}

export default BestDeals;
