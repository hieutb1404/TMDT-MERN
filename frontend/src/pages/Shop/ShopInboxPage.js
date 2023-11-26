import DashboardMessage from '~/components/Shop/DashboardMessage';
import DashboardHeader from '~/components/Shop/Layout/DashboardHeader';
import DashboardSidebar from '~/components/Shop/Layout/DashboardSidebar';

function ShopInboxPage() {
  return (
    <div>
      <div>
        <DashboardHeader />
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <DashboardSidebar active={8} />
          </div>
          <DashboardMessage />
        </div>
      </div>
    </div>
  );
}

export default ShopInboxPage;
