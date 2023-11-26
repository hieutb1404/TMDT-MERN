import axios from 'axios';
import { useState } from 'react';
import { AiOutlineCamera } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { loadSeller } from '~/redux/actions/User';
import { backend_url, server } from '~/server';
import styles from '~/styles/styles';

function ShopSettings() {
  const { seller } = useSelector((state) => state.seller);
  const [avatar, setAvatar] = useState();
  const [name, setName] = useState(seller && seller.name);
  const [description, setDescription] = useState(seller && seller.description);
  const [address, setAddress] = useState(seller && seller.address);
  const [phoneNumber, setPhoneNumber] = useState(seller && seller.phoneNumber);
  const [zipCode, setZipCode] = useState(seller && seller.zipCode);
  const dispatch = useDispatch();

  const handleImage = async (e) => {
    e.preventDefault();

    const file = e.target.files[0];

    setAvatar(file);

    // thêm một cặp giá trị (tên field database và giá trị)
    const formData = new FormData();
    formData.append('image', e.target.files[0]);

    await axios
      .put(`${server}/shop/update-shop-avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      })
      .then((res) => {
        dispatch(loadSeller());
        toast.success('Avatar successfully!');
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const updateHandler = async (e) => {
    e.preventDefault();

    await axios
      .put(
        `${server}/shop/update-shop-info`,
        {
          name,
          description,
          address,
          phoneNumber,
          zipCode,
        },
        { withCredentials: true },
      )
      .then((res) => {
        toast.success('Shop info updated successfully!');
        dispatch(loadSeller());
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="w-full min-h-screen flex flex-col items-center">
      <div className="flex w-full 800px:w-[80%]  flex-col justify-center my-5">
        <div className="w-full flex item-center justify-center ">
          <div className="relative">
            <img
              src={avatar ? URL.createObjectURL(avatar) : `${backend_url}/${seller.avatar}`}
              alt=""
              className="w-[200px] h-[200px] rounded-full cursor-pointer"
            />
            <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[10px] right-[10px]">
              <input type="file" id="image" className="hidden" onChange={handleImage} />
              <label htmlFor="image">
                <AiOutlineCamera />
              </label>
            </div>
          </div>
        </div>
        {/*  */}

        <form
          aria-aria-required={true}
          className="flex flex-col items-center"
          onSubmit={updateHandler}
        >
          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Name</label>
              <input
                type="name"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                placeholder={`${seller?.name}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Description</label>
              <input
                type="name"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                placeholder={`${
                  seller?.description ? seller.description : 'Enter your shop description'
                }`}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Address</label>
              <input
                type="name"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                placeholder={`${seller?.address}`}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Phone Number</label>
              <input
                type="number"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                placeholder={`${seller?.phoneNumber}`}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <div className="w-full pl-[3%]">
              <label className="block pb-2">Shop Zip Code</label>
              <input
                type="number"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                placeholder={`${seller?.zipCode}`}
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
          </div>

          <div className="w-[100%] flex items-center flex-col 800px:w-[50%] mt-5">
            <input
              type="submit"
              className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
              required
              readOnly
              value="Update Shop"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ShopSettings;
