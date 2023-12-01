import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '~/styles/styles';
import { categoriesData } from '~/static/data';
import { AiOutlineHeart, AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { BiMenuAltLeft } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';

import DropDown from '~/layouts/components/DropDown/DropDown';
import Navbar from '~/layouts/components/Navbar/Navbar';
import { useSelector } from 'react-redux';
import { backend_url } from '~/server';
import Cart from '~/components/Cart/Cart';
import Wishlist from '~/components/Wishlist/Wishlist';
import { RxCross1 } from 'react-icons/rx';

function Header({ activeHeading }) {
  // state được lấy ra bởi vì store export ra toàn cục component
  // trong redux user có thuộc tính nào thì ta lấy ra thuộc tính nó = đúng tên biến mới ở ngoài, ở đây t có 3 biến cần lấy giống trong redux
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);

  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // thằng này sẽ đc đưa về onChange nên ko cần vào useEffect để cập nhật giá trị liên tục
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // thằng này sẽ đc đưa vào fillter nên ko cần vào useEffect để cập nhật giá trị liên tục
    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        // kiểm sau khi nhập giá trị vào input bằng lắng nghe sự nghiện target biến term
        // includes (bolean true - false)
        // sẽ dùng includes để kiểm tra so sánh xem trong data vs input nhập vào có giá trị giống nhau hay không (nếu giống nhau includes sẽ trả về true, ngược lại sẽ trả về false)
        product.name.toLowerCase().includes(term.toLowerCase()),
      );
    setSearchData(filteredProducts);
  };

  window.addEventListener('scroll', () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setSearchData(null);
      }
    };

    // muốn thay đổi giá trị tắt bảng search khi để rỗng trong input search thì ta phải đặt điều kiện trong useEffect để nó cập nhật giá trị dữ liệu liên tục
    if (searchTerm === '') {
      setSearchData(null);
    }

    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, [searchTerm]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleClickOutside = (event) => {
    // dropdownRef.current có tồn tại và có chứa phần tử mà sự kiện click xảy ra không. Để thực hiện điều này thì phải thêm ref={dropdownRef} vào thẻ element xem nó đã đc đưa vào thẻ chưa
    // !dropdownRef.current.contains(event.target) kiểm tra xem sự kiện click đã xảy ra bên ngoài dropdown hay không. Nếu đúng tức là người dùng đã click bên ngoài dropdown, và sẽ gọi setDropDown(false) để đóng dropdown
    // !dropdown.current nghĩa là người dùng đã click ra ngoài thẻ chứa ref={dropdownRef}
    // còn dropdown.current là người dùng click trong thẻ chứa ref={dropdownRef}
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropDown(false);
    }
  };

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src="https://cdn.shortpixel.ai/spai/q_lossy+w_153+h_46+to_webp+ret_img/vietnamisawesome.com/wp-content/uploads/2023/02/via-logo.svg"
                alt=""
                className="w-[160px] h-[70px]"
              />
            </Link>
          </div>
          {/* search */}
          <div className="w-[50%] relative" ref={inputRef}>
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md "
            />
            <AiOutlineSearch size={30} className="absolute right-2 top-1.5 cursor-pointer" />
            {/* hiển thị danh sách sản phẩm tìm kiếm (searchData) khi có dữ liệu và có ít nhất một sản phẩm trong danh sách */}
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-4">
                {searchData &&
                  searchData.map((i, index) => {
                    const d = i.name;
                    // /\s+/g trong hàm replace là một biểu thức chính quy (regex) được sử dụng để tìm kiếm tất cả các khoảng trắng (spaces, dấu cách) trong chuỗi.
                    // replace được sử dụng để thay thế các khoảng trắng /\s+/g (spaces, dấu cách) bằng dấu gạch ngang '-'.
                    const Product_name = d.replace(/\s+/g, '-');
                    return (
                      <Link to={`/product/${Product_name}`}>
                        <div className="w-full flex items-start py-3">
                          <img
                            src={`${backend_url}${i && i.images[0]}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>

          <div className={`${styles.button}`}>
            <Link to={`${isSeller ? '/dashboard' : 'shop_create'}`}>
              <h1 className="text-[#fff] flex items-center">
                {isSeller ? 'Go Dashboard' : 'Become Seller'}
                <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`${
          active === true ? 'shadow-sm fixed top-0 left-0 z-10' : null
        } transition hidden 800px:flex items-center justify-between w-full bg-[#3321c8] h-[70px]`}
      >
        <div className={`${styles.section} relative ${styles.noramlFlex} justify-between`}>
          {/* categories */}
          <div>
            <div
              /**  vì thằng div này là thằng bị ẩn và chìm sâu bị đè bởi các thẻ div khác nên ta có thể đưa ref={dropdownRef} ở đây để dấu đi vì thẻ div này bị các thẻ div và các element khác đè lên,
               * nên khi người dùng click vào nó sẽ ko tìm thấy  dropdownRef và lọt vào điều kiện !dropdownRef là ko thấy dropdownRef ở đâu và trả về setDropdown = false */
              // nói chung khi bấm  ra bên ngoài mà các thẻ khác ko có ref={dropdownRef} thì sẽ lọt vào điều kiện login ở trên là !dropdownRef nghĩa là ko tìm thấy thẻ chứa ref={dropdownRef}
              // còn có bấm trúng thẻ chứa ref = {dropdownRef} thì đúng điều kiện và ko có gì xảy ra
              ref={dropdownRef}
              className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block"
            >
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                onClick={() => setDropDown(!dropDown)}
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown categoriesData={categoriesData} setDropDown={setDropDown} />
              ) : null}
            </div>
          </div>
          {/* navigate */}
          <div className={`${styles.noramlFlex}`}>
            <Navbar active={activeHeading} />
          </div>

          <div className="flex">
            {/* heart */}
            <div className={`${styles.noramlFlex}`}>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishList(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top rigt p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>

            {/* cart */}
            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]" onClick={() => setOpenCart(true)}>
                <AiOutlineShoppingCart size={30} color="rgb(255 255 255 / 83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top rigt p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>

            {/* user */}
            <div className={`${styles.noramlFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated ? (
                  <Link to="/profile">
                    {/* lấy được avatar là do t chọc đến đúng địa chỉ ảnh trong dữ liệu
                      - ở đây user được useSelect get từ dữ liệu link dạng json từ backend trong redux và redux lấy từ backend (muốn rõ hơn vào actions/User.js là ta sẽ thấy đc user đc ghet ra từ đó và useSelect import vào dây)
                    */}
                    <img
                      src={`${backend_url}${user.avatar}`}
                      alt=""
                      className="w-[35px] h-[35px] rounded-full"
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 / 83%)" />
                  </Link>
                )}
              </div>
            </div>

            {/* cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishList ? <Wishlist openWishList={setOpenWishList} /> : null}
          </div>
        </div>
      </div>

      {/* header mobile */}

      <div
        className={`${active === true ? 'shadow-sm fixed top-0 left-0 z-10' : null}
      w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between">
          <div>
            <BiMenuAltLeft size={40} className="ml-4" onClick={() => setOpen(true)} />
          </div>

          <div>
            <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt=""
                className="mt-3 cursor-pointer"
              />
            </Link>
          </div>

          <div>
            <div className="relative mr-[20px] ">
              <AiOutlineShoppingCart size={30} />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top rigt p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
        </div>

        {/* header sidebar mobile*/}
        {open && (
          <div className="fixed w-full bg-[#0000005f] z-20 h-full top-0 left-0">
            <div className="fixed w-[60%] bg-[#fff] h-screen top-0 left-0 z-10 overflow-y-scroll">
              <div className="w-full justify-between flex pr-3">
                <div>
                  <div className="relative mr-[15px]">
                    <AiOutlineHeart size={30} className="mt-5 ml-3" />
                    <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 top rigt p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                      {wishlist && wishlist.lenth}
                    </span>
                  </div>
                </div>

                <div>
                  <RxCross1 size={30} className="ml-4 mt-5" onClick={() => setOpen(false)} />
                </div>
              </div>

              <div className="my-8 w-[92%] m-auto h-[40px] relative">
                <input
                  type="text"
                  placeholder="Search Product..."
                  className="h-[40px] w-full px-2 border-[#3957db] border-[2px] rounded-md"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />

                {searchData && (
                  <div className="absolute bg-[#fff] z-10 shadow w-full left-0 p-3">
                    {searchData.map((i) => {
                      const d = i.name;
                      const Product_name = d.replace(/\s+/g, '-');

                      return (
                        <Link to={`/product/${i._id}`}>
                          <div className="flex items-center">
                            <img src={i.image_Url[0].url} alt="" className="w-[50px] mr-2" />
                            <h5>{i.name}</h5>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>

              <Navbar active={activeHeading} />
              <div className={`${styles.button} ml-4 !rounded-[4px]`}>
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              </div>
              <br />
              <br />
              <br />
              <div className="flex w-full justify-center">
                {/* neu chua dang nhap moi hien */}
                {isAuthenticated ? (
                  <div>
                    <Link to="/profile">
                      <img
                        src={`${backend_url}${user.avatar}`}
                        alt=""
                        className="w-[50px] h-[50px] rounded-full border-[3px] border-[#0cac88]"
                      />
                    </Link>
                  </div>
                ) : (
                  <>
                    <Link to="/login" className="text-[18px] pr-[10px] text-[#000000b7]">
                      Login /
                    </Link>
                    <Link to="/signup text-[18px] pr-[10px] text-[#000000b6]">Sign up</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Header;
