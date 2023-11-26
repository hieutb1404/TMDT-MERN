import CreateProduct from '~/components/Shop/CreateProduct';
import DashboardHeader from '~/components/Shop/Layout/DashboardHeader';
import DashboardSidebar from '~/components/Shop/Layout/DashboardSidebar';

function ShopCreateProduct() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-center justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSidebar active={4} />
        </div>
        <div className="w-full justify-center flex">
          <CreateProduct />
        </div>
      </div>
    </div>
  );
}

export default ShopCreateProduct;
