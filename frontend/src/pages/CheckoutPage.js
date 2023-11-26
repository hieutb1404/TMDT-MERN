import Checkout from '~/components/Checkout/Checkout';
import CheckoutSteps from '~/components/Checkout/CheckoutSteps';
import Footer from '~/layouts/components/Footer';
import Header from '~/layouts/components/Header';

function CheckoutPage() {
  return (
    <div>
      <Header />
      <br />
      <br />
      <CheckoutSteps active={1} />
      <Checkout />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default CheckoutPage;
