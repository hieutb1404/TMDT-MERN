import CheckoutSteps from '~/components/Checkout/CheckoutSteps';
import Payment from '~/components/Payment/Payment';
import Footer from '~/layouts/components/Footer';
import Header from '~/layouts/components/Header';

function PaymentPage() {
  return (
    <div className="w-full min-h-screen bg-[#f6f9fc]">
      <Header />
      <br />
      <br />
      <CheckoutSteps active={2} />
      <Payment />
      <br />
      <br />
      <Footer />
    </div>
  );
}

export default PaymentPage;
