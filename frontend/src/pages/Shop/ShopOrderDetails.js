import Footer from '~/layouts/components/Footer';
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader';
import OrderDetails from '~/components/Shop/OrderDetails';

function ShopOrderDetails() {
  return (
    <div>
      <DashboardHeader />
      <OrderDetails />
      <Footer />
    </div>
  );
}

export default ShopOrderDetails;
