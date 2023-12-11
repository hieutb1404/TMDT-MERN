import AdminSideBar from '~/components/Admin/Layout/AdminSideBar';
import AdminHeader from '~/components/Shop/Layout/AdminHeader';

function AdminDashboardWithdraw() {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={7} />
          </div>
          {/* <AllSellers /> */}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardWithdraw;
