import React from 'react';
import Lottie from 'react-lottie';
import Footer from '~/layouts/components/Footer';
import Header from '~/layouts/components/Header';
import animationData from '~/Assests/animations/107043-success.json';

function OrderSuccessPage() {
  return (
    <div>
      <Header />
      <Success />
      <Footer />
    </div>
  );
}
// defaultOptions chứa cấu hình cho hình hoạt hình Lottie. loop xác định xem hình hoạt hình có lặp lại không, autoplay xác định xem hình hoạt hình có tự động phát không, animationData chứa dữ liệu hình hoạt hình, rendererSettings xác định cách hình hoạt hình được hiển thị.
//Lottie component từ thư viện react-lottie được sử dụng để hiển thị hình hoạt hình Lottie. options truyền vào cấu hình đã được thiết lập ở trên, và width cùng height xác định kích thước của hình hoạt hình.
const Success = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div>
      <Lottie options={defaultOptions} width={300} height={300} />
      <h5 className="text-center mb-14 text-[25px] text-[#000000a1]">
        Your order is successful 😍
      </h5>
      <br />
      <br />
    </div>
  );
};

export default OrderSuccessPage;
