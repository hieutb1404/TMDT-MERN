import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Signup from '~/components/Signup/Signup';

function SignupPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);
  //neu nguoi dung ma dang nhap roi van~ co tinh vao /login de dang nhap tiep thi tu dong quay ve trang chu ko cho vao login
  useEffect(() => {
    if (isAuthenticated === true) {
      navigate('/');
    }
  }, []);

  return (
    <div>
      <Signup />
    </div>
  );
}

export default SignupPage;
