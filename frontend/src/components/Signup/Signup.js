import { useState } from 'react';

import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { RxAvatar } from 'react-icons/rx';
import { Link, useNavigate } from 'react-router-dom';
import styles from '~/styles/styles';
import axios from 'axios';
import { server } from '../../server';
import { toast } from 'react-toastify';

function Signup() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  // visibale để làm phẩn dễ thấy mật khẩu
  const [visible, setVisible] = useState(false);
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };
  // Axios được sử dụng để tương tác với các API từ phía client (từ bên ngoài) và gửi các yêu cầu HTTP đến máy chủ (server). Bằng cách sử dụng Axios, bạn có thể gửi yêu cầu GET, POST, PUT, DELETE và nhiều loại yêu cầu khác từ ứng dụng của bạn tới máy chủ và nhận các phản hồi từ máy chủ. Điều này cho phép bạn lấy dữ liệu từ các API, gửi dữ liệu mới đến máy chủ và thực hiện các thao tác khác liên quan đến tương tác với API.
  const handleSubmit = async (e) => {
    e.preventDefault();
    const config = { headers: { 'Content-Type': 'multipart/form-data' } };

    // tao ban sao de chua du lieu tu form sau khi chua du lieu form xong no se gui ve server
    const newForm = new FormData();

    // append se them gia tri moi duoc lay vao ban sao new va gui tat ca ve server
    newForm.append('file', avatar);
    newForm.append('name', name);
    newForm.append('email', email);
    newForm.append('password', password);

    // đối số thứ nhất là URL API mà bạn muốn gửi yêu cầu POST tới. Đối số thứ hai là dữ liệu bạn muốn gửi, trong trường hợp này là đối tượng newForm chứa các giá trị bạn đã thêm bằng append(). Đối số thứ ba là cấu hình tùy chọn cho yêu cầu, như tiêu đề yêu cầu, kiểu dữ liệu, v.v.
    // axios.post(${server}/user/create-user, newForm, config) sẽ gửi một yêu cầu POST đến URL ${server}/user/create-user với dữ liệu từ đối tượng newForm và cấu hình tùy chọn từ config. Server có thể nhận dữ liệu từ yêu cầu này và xử lý nó theo logic tương ứng trong mã server.
    axios
      .post(`${server}/user/create-user`, newForm, config)
      .then((res) => {
        //Trong phản hồi từ API, thông tin trả về từ server thường nằm trong thuộc tính data của đối tượng phản hồi (res). Trong trường hợp bạn muốn truy cập vào dữ liệu từ server, bạn có thể sử dụng res.data.
        // res mặc định là phản hồi
        // data mặc định là dữ liệu trong Promise
        toast.success(res.data.message);
        setName('');
        setEmail('');
        setPassword('');
        setAvatar();
      })
      .catch((error) => {
        // check lỗi từ server thì dùng như này để biết đc chi tiết
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Register as a new user
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="text"
                  // autoComplete để lưu lại giá trị khi người dùng bấm vào lưu đăng nhập, khi đăng xuất ra nó sẽ gợi nhớ lại mà không cần nhập
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="apprearance-none block w-full px-3 py-2 border border-gray-300 rounded shadow-sm placeholder-gray-400 focus:outline"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  // autoComplete để lưu lại giá trị khi người dùng bấm vào lưu đăng nhập, khi đăng xuất ra nó sẽ gợi nhớ lại mà không cần nhập
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="apprearance-none block w-full px-3 py-2 border border-gray-300 rounded shadow-sm placeholder-gray-400 focus:outline"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  // nếu = true thì về dạng text ai cũng nhìn đc ngược lại thì false
                  type={visible ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="apprearance-none block w-full px-3 py-2 border border-gray-300 rounded shadow-sm placeholder-gray-400 focus:outline"
                />

                {visible ? (
                  <AiOutlineEye
                    className="absolute right-2 top-2 cursor-pointer"
                    size="25"
                    // nếu click vao thằng mắt ko gạch chéo thì set lại bằng false mà = false sẽ về điều kiện dưới, tương tự click tiếp theo
                    onClick={() => setVisible(false)}
                  />
                ) : (
                  <AiOutlineEyeInvisible
                    className="absolute right-2 top-2 cursor-pointer"
                    size="25"
                    onClick={() => setVisible(true)}
                  />
                )}
              </div>
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700"></label>
              <div className="mt-2 flex items-center">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden">
                  {avatar ? (
                    <img
                      // URL.createObjectUrl để hiện avavatar người dùng nhìn thấy được chứ k phải là ảnh lỗi
                      src={URL.createObjectURL(avatar)}
                      alt="avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <RxAvatar className="h-8 w-8" />
                  )}
                </span>
                <label
                  htmlFor="file-input"
                  className="ml-5 flex items-center justify-center px-4 py-2 border-gray-300 rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <span>
                    Upload a fle
                    <input
                      type="file"
                      name="avatar"
                      id="file-input"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileInputChange}
                      className="sr-only"
                    />
                  </span>
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full h-[40px] flex justify-center py-2 px-4 border-transparent text-sm font-medium rounded text-white bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
            <div className={`${styles.noramlFlex} w-full`}>
              <h4>Already have an account?</h4>
              <Link to="/login" className="text-blue-600 pl-2">
                Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
