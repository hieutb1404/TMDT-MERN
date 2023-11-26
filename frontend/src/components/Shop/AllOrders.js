import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useEffect } from 'react';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '~/layouts/Loader/Loader';
import { getAllOrdersOfShop } from '~/redux/actions/Order';

function AllOrders() {
  const { orders, isLoading } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

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
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full mx-8 pt-1 mt-10 bg-white">
          <DataGrid rows={row} columns={columns} pageSize={10} disableSelectionOnClick autoHeight />
        </div>
      )}
    </>
  );
}

export default AllOrders;
