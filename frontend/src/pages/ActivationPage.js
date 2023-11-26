import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { server } from '~/server';

function ActivationPage() {
  const { activation_token } = useParams();
  const [error, setError] = useState(false);

  useEffect(() => {
    if (activation_token) {
      const sendRequest = async () => {
        await axios
          .post(`${server}/user/activation`, {
            activation_token,
          })
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            console.log(err); // Kiểm tra thông báo lỗi từ máy chủ
            setError(true);
          });
      };
      sendRequest();
    }
  }, []);
  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {error ? <p>Your token is expires</p> : <p>Your account has been created successfully</p>}
    </div>
  );
}

export default ActivationPage;
