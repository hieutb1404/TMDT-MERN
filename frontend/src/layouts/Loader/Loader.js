import Lottie from 'react-lottie';
import animation from '~/Assests/animations/animation_lmp125qd.json';

function Loader() {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Lottie options={defaultOptions} width={300} height={300} />

      <br />
      <br />
    </div>
  );
}

export default Loader;
