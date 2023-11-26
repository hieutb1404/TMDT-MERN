import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ShopLogin from '~/components/Shop/ShopLogin';

function ShopLoginPage() {
  const navigate = useNavigate();
  // state.seller lay trong store
  const { isSeller, isLoading } = useSelector((state) => state.seller);
  //neu nguoi dung ma dang nhap roi van~ co tinh vao /login de dang nhap tiep thi tu dong quay ve trang chu ko cho vao login
  useEffect(() => {
    if (isSeller === true) {
      navigate(`/dashboard`);
    }
  }, [isLoading, isSeller]);

  return (
    <div>
      <ShopLogin />
    </div>
  );
}

export default ShopLoginPage;
