import { useEffect, useState } from 'react';

function CountDown({ data }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  function calculateTimeLeft() {
    // const difference = +new Date(data.Finish_Date) - +new Date(); tính toán sự khác biệt thời gian bằng cách lấy thời gian kết thúc (Finish_Date) và trừ đi thời gian hiện tại. Kết quả difference sẽ cho biết thời gian còn lại hoặc thời gian đã trôi qua giữa thời điểm kết thúc và thời điểm hiện tại. Nếu difference là một số dương, thì nó biểu thị thời gian còn lại, và nếu difference là một số âm, thì nó biểu thị thời gian đã trôi qua.
    const difference = +new Date(data.Finish_Date) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  }
  // Object.keys để lấy danh sách các thuộc tính (days, hours, minutes, seconds) trong đối tượng timeLeft. Tiếp theo, ta dùng map để tạo một mảng timerComponent, trong đó mỗi phần tử của mảng là một span chứa giá trị và tên của từng thuộc tính.
  // Nếu giá trị của thuộc tính là 0 hoặc không tồn tại, ta sẽ trả về null, nghĩa là không hiển thị phần tử đó.
  const timerComponent = Object.keys(timeLeft).map((interval) => {
    if (!timeLeft[interval]) {
      return null;
    }
    // interval để truy cập vào thuộc tính tương ứng của timeLeft. Ví dụ, nếu interval là 'days', thì {timeLeft[interval]} sẽ hiển thị giá trị của days trong timeLeft.
    return (
      <span className="text-[25px] text-[#475ad2]">
        {timeLeft[interval]} {interval} {''}
      </span>
    );
  });

  return (
    <div>
      {timerComponent.length ? (
        timerComponent
      ) : (
        <span className="text-[red] text-[25px] ">Time's up!</span>
      )}
    </div>
  );
}

export default CountDown;
