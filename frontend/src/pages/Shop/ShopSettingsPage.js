import DashboardHeader from '~/components/Shop/Layout/DashboardHeader';
import DashboardSidebar from '~/components/Shop/Layout/DashboardSidebar';
import ShopSettings from '~/components/Shop/ShopSettings';

function ShopSettingPage() {
  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSidebar active={11} />
        </div>
        <ShopSettings />
      </div>
    </div>
  );
}

export default ShopSettingPage;
