import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Footer from '~/layouts/components/Footer';
import Header from '~/layouts/components/Header';
import ProductDetails from '~/components/Products/ProductDetails';
import SuggestedProduct from '~/components/Products/SuggestedProduct';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProductDetailsPage() {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  // id duong dan thay = name
  const { id } = useParams();
  //   // để lấy các query parameters từ URL. searchParams chứa tất cả các query parameter dưới dạng một đối tượng URLSearchParams.
  const [searchParams] = useSearchParams();
  //  lấy giá trị của query parameter 'isEvent' từ searchParams bằng cách sử dụng phương thức get('isEvent').
  const eventData = searchParams.get('isEvent');
  const [data, setData] = useState(null);
  // thay the /-/g = (khoang cach trang`)
  // thay dia chi url  ten san pham tu dau - thanh khoang cach trang de so sanh voi du lieu trong data base
  // vd: urL : iphone-14-promax se~ ko so sanh dc data base iphone 14 promax nen ta phai doi lai tu iphone-14-promax thanh iphone 14 promax de giong voi database de so sanh
  // vi thang productCard tra ve name nen thang nay cua phai tra ve name lay ra san pham theo name

  useEffect(() => {
    //hông có query parameter 'isEvent' trong URL), bạn sẽ sắp xếp eventData theo số lượng bán hàng (total_sell) và lưu kết quả vào state data
    // nghia la lay ra toan bo san pham theo gia tien cao den thap
    // neu tren URL co isEvent thi hien san pham theo Event
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i._id === id);
      setData(data);
    } else {
      // nguoc lai neu ko co isEvent thi hien san pham theo products
      const data = allProducts && allProducts.find((i) => i._id === id);
      setData(data);
    }
  }, [allProducts, allEvents]);
  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {!eventData && <>{data && <SuggestedProduct data={data} />}</>}
      <Footer />
    </div>
  );
}

export default ProductDetailsPage;
