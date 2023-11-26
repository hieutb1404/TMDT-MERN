import { useSelector } from 'react-redux';
import Loader from '~/layouts/Loader/Loader';

const { Navigate } = require('react-router-dom');

const SelectProtectedRoute = ({ children }) => {
  const { isLoading, isSeller } = useSelector((state) => state.seller);

  if (isLoading === true) {
    return <Loader />;
  } else {
    if (!isSeller) {
      return <Navigate to={`/shop-login`} replace />;
    }
    return children;
  }
};

export default SelectProtectedRoute;
