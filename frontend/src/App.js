import { Fragment, useEffect, useState } from 'react';
import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { publicRouters } from '~/routers';
import DefaultLayout from '~/layouts/DefaultLayout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Store from './redux/store';
import { loadSeller, loadUser } from './redux/actions/User';
import ProtectedRoute from './routers/ProtectedRoute';
import SelectProtectedRoute from './routers/SelectProtectedRoute';
import { getAllProducts } from './redux/actions/Product';
import { getAllEvents } from './redux/actions/Event';
import axios from 'axios';
import { server } from './server';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ProtectedAdminRouter from './routers/ProtectedAdminRouter';

//  withCredentials: true cho phép server máy chủ gốc truy cập với tên miền khác khi lấy dữ liệu hoặc đẩy dữ liệu

function App() {
  const [stripeApikey, setStripeApiKey] = useState('');

  async function getStripeApikey() {
    const { data } = await axios.get(`${server}/payment/stripeapikey`);
    setStripeApiKey(data.stripeApikey);
  }

  useEffect(() => {
    // Trong store chứa user của file reducers, mà khi ta dùng Store.dispatch(loadUser()) là ta đang truyền dữ liệu vào Store , khi đấy user nằm trong Store sẽ nhận được dữ liệu LoadUser() truyền vào này
    // dispatch ở đây giống như action ta có thể gọi cách khách là Store.action = store.dispatch
    //// Khi bạn gọi Store.dispatch(loadUser()), action loadUser() sẽ được gửi đến reducer userReducer và reducer này sẽ thực hiện việc xử lý action.
    // userReducer chịu trách nhiệm xử lý action loadUser(), có thể là để lấy dữ liệu người dùng từ server và cập nhật lại state của "user" trong Redux store. Sau khi reducer thực hiện xong, state của "user" trong Redux store sẽ được cập nhật theo kết quả xử lý của action loadUser().
    // Store.dispatch(loadUser()), nó sẽ kích hoạt việc xử lý action và thay đổi state trong Redux store dựa trên reducer đã được cấu hình. Sau khi action được xử lý, bạn có thể sử dụng useSelector để lấy dữ liệu từ Redux store ra sử dụng trong các component.

    Store.dispatch(loadUser());
    Store.dispatch(loadSeller());
    Store.dispatch(getAllProducts());
    Store.dispatch(getAllEvents());
    getStripeApikey();
  }, []); // // Đặt dependency rỗng nếu bạn chỉ muốn chạy một lần

  return (
    <Router>
      <div className="App">
        <Routes>
          {publicRouters.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;
            // kiểm tra xem có điều kiện là router có layout, và có điều kiện là null hay không
            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={
                  <Layout>
                    {route.path === '/checkout' && (
                      <ProtectedRoute>
                        <Page />
                      </ProtectedRoute>
                    )}
                    {/* neu login= true thi tra ve profile ko thi tra ve /login */}
                    {route.path === '/profile' && (
                      <ProtectedRoute>
                        <Page />
                      </ProtectedRoute>
                    )}
                    {route.path === '/inbox' && (
                      <ProtectedRoute>
                        <Page />
                      </ProtectedRoute>
                    )}
                    {route.path === '/user/order/:id' && (
                      <ProtectedRoute>
                        <Page />
                      </ProtectedRoute>
                    )}
                    {route.path === '/user/track/order/:id' && (
                      <ProtectedRoute>
                        <Page />
                      </ProtectedRoute>
                    )}
                    {route.path === '/shop/:id' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/settings' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard-create-product' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard-products' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard-orders' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard-refunds' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/order/:id' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard-create-event' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard-events' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard-coupouns' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/product/update/:id' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard-withdraw-money' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/dashboard-messages' && (
                      <SelectProtectedRoute>
                        <Page />
                      </SelectProtectedRoute>
                    )}
                    {route.path === '/payment' && stripeApikey && (
                      <Elements stripe={loadStripe(stripeApikey)}>
                        <ProtectedRoute>
                          <Page />
                        </ProtectedRoute>
                      </Elements>
                    )}
                    {/* admin */}
                    {route.path === '/admin/dashboard' && (
                      <ProtectedAdminRouter>
                        <Page />
                      </ProtectedAdminRouter>
                    )}
                    {route.path === '/admin-users' && (
                      <ProtectedAdminRouter>
                        <Page />
                      </ProtectedAdminRouter>
                    )}
                    {route.path === '/admin-sellers' && (
                      <ProtectedAdminRouter>
                        <Page />
                      </ProtectedAdminRouter>
                    )}
                    {route.path === '/admin-orders' && (
                      <ProtectedAdminRouter>
                        <Page />
                      </ProtectedAdminRouter>
                    )}

                    {route.path !== '/checkout' &&
                      route.path !== '/profile' &&
                      route.path !== '/inbox' &&
                      route.path !== '/user/order/:id' &&
                      route.path !== '/user/track/order/:id' &&
                      route.path !== '/shop/:id' &&
                      route.path !== '/dashboard' &&
                      route.path !== '/dashboard-create-product' &&
                      route.path !== '/dashboard-products' &&
                      route.path !== '/dashboard-create-event' &&
                      route.path !== '/dashboard-events' &&
                      route.path !== '/dashboard-coupouns' &&
                      route.path !== '/dashboard-withdraw-money' &&
                      route.path !== '/settings' &&
                      route.path !== '/dashboard-orders' &&
                      route.path !== '/dashboard-refunds' &&
                      route.path !== '/dashboard-messages' &&
                      route.path !== '/order/:id' &&
                      route.path !== '/product/update/:id' &&
                      // admin
                      route.path !== '/admin/dashboard' &&
                      route.path !== '/admin-sellers' &&
                      route.path !== '/admin-users' &&
                      route.path !== '/admin-orders' &&
                      route.path !== '/payment' && <Page />}
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </div>
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </Router>
  );
}

export default App;
