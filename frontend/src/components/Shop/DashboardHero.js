import { useEffect, useState } from 'react';
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from 'react-icons/ai';
import { MdBorderClear } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { DataGrid } from '@material-ui/data-grid';
import { Button } from '@material-ui/core';

import { Link } from 'react-router-dom';
import { getAllOrdersOfShop } from '~/redux/actions/Order';
import { getAllProductsShop } from '~/redux/actions/Product';
import styles from '~/styles/styles';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LinearScale, PointElement, LineElement, BarElement, CategoryScale } from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, LinearScale, PointElement, LineElement, BarElement, CategoryScale);





function DashboardHero() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const { products } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
    dispatch(getAllProductsShop(seller._id));
  }, [dispatch]);

  const availableBalance = seller?.availableBalance.toFixed(2);
// Chuyển đổi dữ liệu đơn hàng thành định dạng cho biểu đồ
// const orderData = orders.map(order => ({
//   date: new Date(order.createAt).toLocaleDateString(),
//   amount: order.totalPrice,
// }));

// const dates = orderData.map(data => data.date);
// const amounts = orderData.map(data => data.amount);

// // Cấu hình dữ liệu cho các biểu đồ
// const lineChartData = {
//   labels: dates,
//   datasets: [
//     {
//       label: 'Order Amount',
//       data: amounts,
//       fill: false,
//       borderColor: 'rgb(75, 192, 192)',
//       tension: 0.1,
//     },
//   ],
// };

// const barChartData = {
//   labels: dates,
//   datasets: [
//     {
//       label: 'Order Amount',
//       data: amounts,
//       backgroundColor: 'rgba(75, 192, 192, 0.2)',
//       borderColor: 'rgba(75, 192, 192, 1)',
//       borderWidth: 1,
//     },
//   ],
// };

// const doughnutChartData = {
//   labels: dates,
//   datasets: [
//     {
//       label: 'Order Amount',
//       data: amounts,
//       backgroundColor: dates.map(() => 'rgba(75, 192, 192, 0.2)'),
//     },
//   ],
// };

  

  // mảng chứa các đối tượng cấu hình cho mỗi cột trong thu vien DataGrid
  const columns = [
    //field: Đây là tên của trường dữ liệu tương ứng trong mảng dữ liệu mà minh cung cấp
    { field: 'id', headerName: 'Order ID', minWidth: 150, flex: 0.7 },

    {
      field: 'status',
      //  Đây là nội dung hiển thị ở phần đầu của cột, thường là tên mô tả cột.
      headerName: 'Status',
      // Đây là chiều rộng tối thiểu của cột, tính bằng pixel.
      minWidth: 130,
      // Đây là giá trị tương ứng với thuộc tính flex của CSS. Nó xác định tỷ lệ mà cột này chiếm trong không gian ngang của DataGrid.
      flex: 0.7,
      // cellClassName: Đây là một hàm callback cho phép bạn cung cấp các lớp CSS cho các ô dữ liệu trong cột.
      // Trong trường hợp này, hàm này dựa trên giá trị của trường 'status' để xác định xem ô dữ liệu nên có lớp CSS greenColor hay redColor. Điều này cho phép bạn tạo các hiệu ứng màu sắc khác nhau cho các ô dựa trên giá trị của trường.
      cellClassName: (params) => {
        return params.getValue(params.id, 'status') === 'Delivered' ? 'greenColor' : 'redColor';
      },
    },
    {
      field: 'itemsQty',
      headerName: 'Items Qty',
      type: 'number',
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: 'total',
      headerName: 'Total',
      type: 'number',
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: ' ',
      flex: 1,
      minWidth: 150,
      headerName: '',
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];
  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        // ten bien gan' moi phai duoc trung` ten voi field trong bien' columns o tren thi gia tri hien vao no moi di dung thu tu cot
        id: item._id,
        itemsQty: item.cart.length,
        total: 'US$ ' + item.totalPrice,
        status: item.status,
      });
    });

    
    
  return (
    <div className="w-full p-8">
    {/* <h3 className="text-[22px] font-Poppins pb-2">Overview</h3>
    <div className="flex flex-wrap justify-between items-start gap-4">
      <div className="flex-1 min-w-[300px]">
        <h2>Line Chart Example</h2>
        <Line data={lineChartData} />
      </div>
      <div className="flex-1 min-w-[300px]">
        <h2>Bar Chart Example</h2>
        <Bar data={barChartData} />
      </div>
      <div className="flex-1 min-w-[300px]">
        <h2>Doughnut Chart Example</h2>
        <Doughnut data={doughnutChartData} />
      </div>
    </div> */}

      <div className="w-full block 800px:flex items-center justify-between">
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085] `}
            >
              Account Balance<span className="text-[16px]">(with 10% service charge)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">${availableBalance}</h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-2 text-[#077f9c]">Withdraw Money</h5>
          </Link>
        </div>

        {/*  */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085] `}
            >
              All Orders
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{orders && orders.length}</h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Orders</h5>
          </Link>
        </div>
        {/*  */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3
              className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085] `}
            >
              All Products
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{products && products.length}</h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c]">View Products</h5>
          </Link>
        </div>
        {/*  */}
      </div>
      <br />
      <h3 className="text-[22px] font-Poppins pb-2">Last Orders</h3>
      <div className="w-full min-h-[45vh] bg-white rounded">
        <DataGrid rows={row} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
      </div>
    </div>
  );
}

export default DashboardHero;
