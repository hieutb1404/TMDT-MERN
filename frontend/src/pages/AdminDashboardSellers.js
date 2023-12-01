import AllSellers from '~/components/Admin/AllSellers';
import AdminSideBar from '~/components/Admin/Layout/AdminSideBar';
import AdminHeader from '~/components/Shop/Layout/AdminHeader';

function AdminDashboardSellers() {
  return (
    <div>
      <AdminHeader />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={3} />
          </div>
          <AllSellers />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardSellers;
