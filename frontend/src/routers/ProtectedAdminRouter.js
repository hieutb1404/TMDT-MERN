import { useSelector } from 'react-redux';

const { Navigate } = require('react-router-dom');

const ProtectedAdminRouter = ({ children }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading === false) {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    } else if (user.role !== 'Admin') {
      return <Navigate to="/" replace />;
    }
    return children;
  }
};

export default ProtectedAdminRouter;
