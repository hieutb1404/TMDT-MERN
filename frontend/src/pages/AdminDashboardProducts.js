import AllProducts from '~/components/Admin/AllProducts';
import AdminSideBar from '~/components/Admin/Layout/AdminSideBar';
import AdminHeader from '~/components/Shop/Layout/AdminHeader';

function AdminDashBoardProducts() {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={5} />
          </div>
          <AllProducts />
        </div>
      </div>
    </div>
  );
}

export default AdminDashBoardProducts;
