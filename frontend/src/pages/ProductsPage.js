import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '~/components/Route/ProductCard/ProductCard';
import Header from '~/layouts/components/Header';
import styles from '~/styles/styles';

function ProductPage() {
  // để lấy các query parameters từ URL. searchParams chứa tất cả các query parameter dưới dạng một đối tượng URLSearchParams.
  const [searchParams] = useSearchParams();
  //  lấy giá trị của query parameter 'category' từ searchParams bằng cách sử dụng phương thức get('category').
  const categoryData = searchParams.get('category');
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (categoryData === null) {
      const d = allProducts;
      setData(d);
    } else {
      const d =
      allProducts && allProducts.filter((i) => i.category === categoryData);
      setData(d);
    }
    //    window.scrollTo(0,0);
  }, [allProducts]);

  return (
    <div>
      <Header activeHeading={3} />
      <br />
      <br />
      <div className={`${styles.section}`}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 ">
          {data && data.map((i, index) => <ProductCard data={i} key={index} />)}
        </div>

        {data && data.length === 0 ? (
          <h1 className="text-center w-full pb-[100px] text-[20px]">No products Found!</h1>
        ) : null}
      </div>
    </div>
  );
}

export default ProductPage;
