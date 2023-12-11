import Config from '~/config';

import LoginPage from '~/pages/Login';
import SignupPage from '~/pages/SignupPage';
import ActivationPage from '~/pages/ActivationPage';
import HomePage from '~/pages/HomePage';
import ProductsPage from '~/pages/ProductsPage';
import BestSellingPage from '~/pages/BestSellingPage';
import Events from '~/pages/EventPage';
import FAQPage from '~/pages/PAQPage';
import ProductDetailsPage from '~/pages/ProductDetailsPage';
import ProfilePage from '~/pages/ProfilePage';
import CheckoutPage from '~/pages/CheckoutPage';
import ShopCreatePage from '~/pages/ShopCreatePage';
import SellerActivationPage from '~/pages/SellerActivationPage';
import ShopLoginPage from '~/pages/ShopLoginPage';
import { ShopHomePage } from '~/ShopRoutes';
import {
  ShopAllEvents,
  ShopAllProducts,
  ShopCreateEvents,
  ShopCreateProduct,
  ShopDashboardPage,
  ShopAllCoupouns,
  ShopAllOrders,
  ShopPreviewPage,
  ShopAllRefunds,
  ShopSettingPage,
  ShopWithDrawMoney,
  ShopInboxPage,
} from '../routers/ShopRoutes';
import PaymentPage from '~/pages/PaymentPage';
import OrderSuccessPage from '~/pages/OrderSuccessPage';
import ShopOrderDetails from '~/pages/Shop/ShopOrderDetails';
import OrderDetailsPage from '~/pages/OrderDetailsPage';
import TrackOrderPage from '~/pages/TrackOrderPage';
import UpdateProduct from '~/components/Shop/UpdateProduct';
import UserInbox from '~/pages/UserInbox';
import AdminDashboardPage from '~/pages/AdminDashboardPage';
import {
  AdminDashBoardProducts,
  AdminDashboardEvents,
  AdminDashboardOrders,
  AdminDashboardSellers,
  AdminDashboardUsers,
  AdminDashboardWithdraw,
} from './AdminRouters';
const publicRouters = [
  // nếu không muốn hiện header , footer thì cho layout = null , nghĩa là layout sẽ = trống
  { path: Config.routers.login, component: LoginPage, layout: null },
  { path: Config.routers.signup, component: SignupPage, layout: null },
  { path: Config.routers.activation, component: ActivationPage, layout: null },
  { path: Config.routers.home, component: HomePage },
  { path: Config.routers.products, component: ProductsPage, layout: null },
  { path: Config.routers.ordersuccess, component: OrderSuccessPage, layout: null },
  { path: Config.routers.bestselling, component: BestSellingPage, layout: null },
  { path: Config.routers.events, component: Events, layout: null },
  { path: Config.routers.faq, component: FAQPage, layout: null },
  { path: Config.routers.product_details, component: ProductDetailsPage, layout: null },
  { path: Config.routers.profile, component: ProfilePage, layout: null },
  { path: Config.routers.checkout, component: CheckoutPage, layout: null },
  { path: Config.routers.payment, component: PaymentPage, layout: null },
  { path: Config.routers.shopcreate, component: ShopCreatePage, layout: null },
  { path: Config.routers.seller_activation, component: SellerActivationPage, layout: null },
  { path: Config.routers.order_details_page, component: OrderDetailsPage, layout: null },
  { path: Config.routers.track_order_details_page, component: TrackOrderPage, layout: null },
  { path: Config.routers.shoplogin, component: ShopLoginPage, layout: null },
  { path: Config.routers.shop_home_page, component: ShopHomePage, layout: null },
  { path: Config.routers.inbox, component: UserInbox, layout: null },
  { path: Config.routers.product_update, component: UpdateProduct, layout: null },
  { path: Config.routers.dashboard, component: ShopDashboardPage, layout: null },
  { path: Config.routers.dashboard_create_product, component: ShopCreateProduct, layout: null },
  { path: Config.routers.dashboard_products, component: ShopAllProducts, layout: null },
  { path: Config.routers.order_details, component: ShopOrderDetails, layout: null },
  { path: Config.routers.dashboard_orders, component: ShopAllOrders, layout: null },
  { path: Config.routers.dashboard_create_event, component: ShopCreateEvents, layout: null },
  { path: Config.routers.dashboard_events, component: ShopAllEvents, layout: null },
  { path: Config.routers.dashboard_refunds, component: ShopAllRefunds, layout: null },
  { path: Config.routers.dashboard_coupouns, component: ShopAllCoupouns, layout: null },
  { path: Config.routers.shop_preview_page, component: ShopPreviewPage, layout: null },
  { path: Config.routers.settings, component: ShopSettingPage, layout: null },
  { path: Config.routers.dashboard_withdraw_money, component: ShopWithDrawMoney, layout: null },
  { path: Config.routers.dashboard_messages, component: ShopInboxPage, layout: null },

  //admin

  { path: Config.routers.admin_dashboard, component: AdminDashboardPage, layout: null },
  { path: Config.routers.admin_all_users, component: AdminDashboardUsers, layout: null },
  { path: Config.routers.admin_all_sellers, component: AdminDashboardSellers, layout: null },
  { path: Config.routers.admin_all_orders, component: AdminDashboardOrders, layout: null },
  { path: Config.routers.admin_all_products, component: AdminDashBoardProducts, layout: null },
  { path: Config.routers.admin_all_events, component: AdminDashboardEvents, layout: null },
  { path: Config.routers.admin_all_withdraw, component: AdminDashboardWithdraw, layout: null },
];
const privateRouters = [];

export { publicRouters, privateRouters };
