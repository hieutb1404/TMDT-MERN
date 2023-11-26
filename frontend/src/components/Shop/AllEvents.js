import { Button } from '@material-ui/core';
import { DataGrid } from '@material-ui/data-grid';
import { useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEye } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Loader from '~/layouts/Loader/Loader';
import { deleteEvent, getAllEventsShop } from '~/redux/actions/Event';
import { deleteProduct, getAllProductsShop } from '~/redux/actions/Product';

function AllEvents() {
  const { events, isLoading } = useSelector((state) => state.events);
  const { seller } = useSelector((state) => state.seller);

  const dispatch = useDispatch();

  useEffect(() => {
    // lấy tất cả sản phẩm theo id của chủ  bán hàng
    // nếu k lấy sp theo id chủ bán hàng thì ta lấy id theo từng event điều này sẽ làm cho tất cả chủ bán hàng nào cũng lấy được id sản phẩm mình đăng bán

    dispatch(getAllEventsShop(seller._id));
  }, [dispatch]);

  // delete product
  const handleDelete = (id) => {
    dispatch(deleteEvent(id));
    // load lai trang hien tai dang dung
    window.location.reload();
  };

  // ten cac cot trong data grid
  const columns = [
    {
      field: 'id',
      headerName: 'Event Id',
      minWidth: 150,
      flex: 0.7,
    },
    {
      field: 'name',
      headerName: 'Name',
      minWidth: 180,
      flex: 1.4,
    },
    {
      field: 'price',
      headerName: 'Price',
      minWidth: 100,
      flex: 0.6,
    },
    {
      field: 'stock',
      headerName: 'Stock',
      type: 'number',
      minWidth: 80,
      flex: 0.5,
    },
    {
      field: 'sold',
      headerName: 'Sold out',
      type: 'number',
      minWidth: 130,
      flex: 0.6,
    },
    {
      field: 'Preview',
      headerName: '',
      type: 'number',
      minWidth: 100,
      flex: 0.8,
      sortable: false,
      renderCell: (params) => {
        const d = params.row.name;
        const product_name = d.replace(/\s+/g, '-');
        return (
          <>
            <Link to={`/product/${product_name}`}>
              <Button>
                <AiOutlineEye size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
    {
      field: 'Delete',
      flex: 0.8,
      minWidth: 120,
      type: 'number',
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            {/* lay id params product hien tai vao doi so de xu ly dispatch dua ve backend */}
            {/* lay id tu field roi dua vao doi so */}

            <Button onClick={() => handleDelete(params.id)}>
              <AiOutlineDelete size={20} />
            </Button>
          </>
        );
      },
    },
  ];

  // ten bien duoc gan phai trung` vs ten filed trong cot de dua ra bang gridview
  const row = [];
  events &&
    events.forEach((item) => {
      row.push({
        id: item._id,
        name: item.name,
        price: 'US$' + item.discountPrice,
        stock: item.stock,
        sold: 10,
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

export default AllEvents;
