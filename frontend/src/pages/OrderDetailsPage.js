import UserOrderDetails from '~/components/UserOrderDetails';
import Footer from '~/layouts/components/Footer';
import Header from '~/layouts/components/Header';

function OrderDetailsPage() {
  return (
    <div>
      <Header />
      <UserOrderDetails />
      <Footer />
    </div>
  );
}

export default OrderDetailsPage;
