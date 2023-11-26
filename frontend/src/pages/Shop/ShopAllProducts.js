import AllProducts from '~/components/Shop/AllProducts';
import DashboardHeader from '~/components/Shop/Layout/DashboardHeader';
import DashboardSidebar from '~/components/Shop/Layout/DashboardSidebar';

function ShopAllProducts() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSidebar active={3} />
        </div>
        <div className="w-full justify-center flex">
          <AllProducts />
        </div>
      </div>
    </div>
  );
}

export default ShopAllProducts;
