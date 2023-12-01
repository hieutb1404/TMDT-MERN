import { AiOutlineGift } from 'react-icons/ai';
import { BiMessageSquareDetail } from 'react-icons/bi';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { MdOutlineLocalOffer } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { backend_url } from '~/server';

function AdminHeader() {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="w-full h-[80px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/dashboard">
          <img
            src="https://cdn.shortpixel.ai/spai/q_lossy+w_153+h_46+to_webp+ret_img/vietnamisawesome.com/wp-content/uploads/2023/02/via-logo.svg"
            alt=""
            className="w-[160px] h-[70px]"
          />
        </Link>
      </div>

      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard/coupons">
            <AiOutlineGift color="#555" size={30} className="mr-5 cursor-pointer" />
          </Link>

          <Link to="/dashboard-events">
            <MdOutlineLocalOffer color="#555" size={30} className="mr-5 cursor-pointer" />
          </Link>

          <Link to="/dashboard-products">
            <FiShoppingBag color="#555" size={30} className="mr-5 cursor-pointer" />
          </Link>

          <Link to="/dashboard-orders">
            <FiPackage color="#555" size={30} className="mr-5 cursor-pointer" />
          </Link>

          <Link to="/dashboard-messages">
            <BiMessageSquareDetail color="#555" size={30} className="mr-5 cursor-pointer" />
          </Link>

          <img
            src={`${backend_url}${user?.avatar}`}
            alt=""
            className="w-[50px] h-[50px] rounded-full object-over"
          />
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
