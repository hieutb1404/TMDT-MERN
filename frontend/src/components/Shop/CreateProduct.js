import { useEffect, useState } from 'react';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProduct } from '~/redux/actions/Product';
import { categoriesData } from '~/static/data';

function CreateProduct() {
  const { seller } = useSelector((state) => state.seller);
  const { success, error } = useSelector((state) => state.products);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [originalPrice, setOriginalPrice] = useState();
  const [discountPrice, setDiscountPrice] = useState();
  const [stock, setStock] = useState();

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (success) {
      toast.success('Product created successfully!');
      navigate('/dashboard');
      window.location.reload();
    }
  }, [dispatch, error, success]);

  const handleImageChange = (e) => {
    e.preventDefault();

    //  tạo một mảng files chứa danh sách các tệp được chọn trong phần tử input.
    // vd : let files = []
    let files = Array.from(e.target.files);
    //  dòng này, prevImages là giá trị trạng thái trước đó của mảng hình ảnh. Hàm này lấy giá trị này, sau đó thêm các tệp hình ảnh mới (...files) vào mảng này, tạo ra một mảng hình ảnh mới sau khi thêm các tệp mới.
    setImages((prevImages) => [...prevImages, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // append (1,2) doi so 1 la phan anh' xa. thuoc tinh database cua backend, doi so 2 la ten cua useState can` truyen vao thuoc tinh data cua doi so 1
    // co the hieu doi so 2 gui POST len voi ten doi so 1 (thay ten moi giong voi database)
    const newForm = new FormData();
    images.forEach((image) => {
      newForm.append('images', image);
    });
    newForm.append('name', name);
    newForm.append('description', description);
    newForm.append('category', category);
    newForm.append('tags', tags);
    newForm.append('originalPrice', originalPrice);
    newForm.append('discountPrice', discountPrice);
    newForm.append('stock', stock);
    newForm.append('shopId', seller._id);

    // di vao trong createProduct cua file actions
    dispatch(createProduct(newForm));
  };

  return (
    <div className="w-[90%] 800px:w-[50%] bg-white  shadow h-[80vh] rounded-[4px] p-3 overflow-y-scroll">
      <h5 className="text-[30px] font-Poppins text-center">Create Product</h5>
      {/* create product form  */}
      <form onSubmit={handleSubmit}>
        <br />

        <div>
          <label className="pb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
            placeholder="Enter your product name..."
          />
        </div>

        <br />

        <div>
          <label className="pb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            cols="30"
            rows="8"
            type="text"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 appearance-none block w-full pt-2 px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
            placeholder="Enter your product description name..."
          ></textarea>
        </div>

        <br />

        <div>
          <label className="pb-2">
            category <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full mt-2 border h-[35px] rounded-[5px]"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Choose a category">Choose a category</option>
            {categoriesData &&
              categoriesData.map((i) => (
                <option value={i.title} key={i.title}>
                  {i.title}
                </option>
              ))}
          </select>
        </div>

        <br />

        <div>
          <label className="pb-2">
            Tags <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
            placeholder="Enter your product tags..."
          />
        </div>

        <br />

        <div>
          <label className="pb-2">
            Original Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
            placeholder="Enter your product price..."
          />
        </div>

        <br />

        <div>
          <label className="pb-2">
            Price (With Discount) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={discountPrice}
            onChange={(e) => setDiscountPrice(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
            placeholder="Enter your product price with discount..."
          />
        </div>

        <br />

        <div>
          <label className="pb-2">
            Product Stock <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-stone-400 focus:outline-none focus:ring-bule-500 sm:text-sm"
            placeholder="Enter your product stock..."
          />
        </div>

        <br />

        <div>
          <label className="pb-2">
            Upload Images <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            name=""
            id="upload"
            className="hidden"
            multiple
            onChange={handleImageChange}
          />
          <div className="w-full flex items-center flex-wrap">
            <label htmlFor="upload">
              <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
            </label>
            {images &&
              images.map((i) => (
                <img
                  src={URL.createObjectURL(i)}
                  key={i}
                  alt=""
                  className="h-[120px] w-[120px] object-cover m-2"
                />
              ))}
          </div>

          <br />

          <div>
            <input
              type="submit"
              value="Create"
              className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateProduct;
