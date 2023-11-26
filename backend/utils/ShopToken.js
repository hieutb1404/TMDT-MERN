// create token and saving that in cookies
// Khi người dùng xác thực thành công, server sẽ tạo ra một token và gửi nó cho client. Sau đó, client sẽ lưu trữ token này và gửi lại cho server trong mỗi yêu cầu sau này.
const sendShopToken = (user, statusCode, res) => {
  // Lấy token từ người dùng bằng cách gọi phương thức getJwtToken() trên đối tượng người dùng. Phương thức này đã được định nghĩa trong schema của người dùng và trả về token mã hóa.
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    // Token được gắn vào cookie và được thiết lập để tồn tại trong 90 ngày (expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)). Điều này có nghĩa là token sẽ tồn tại và được gửi lại cho server trong mỗi yêu cầu sử dụng tài nguyên trong khoảng thời gian 90 ngày kể từ khi token được thiết lập.
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    // Tùy chọn httpOnly được đặt để chỉ cho phép truy cập cookie thông qua HTTP và không cho phép truy cập qua JavaScript.
    httpOnly: true,
  };
  // Gửi phản hồi về client với mã trạng thái và cookies. Phương thức cookie() của đối tượng phản hồi được sử dụng để thiết lập cookie với tên là "token" và giá trị là token đã tạo. Sau đó, phản hồi được trả về dưới dạng JSON với các thông tin thành công, đối tượng người dùng và token.
  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    user,
    token,
  });
};

// Từ đó, người dùng sẽ được phép sử dụng tài nguyên từ server trong 90 ngày mà không cần phải xác thực lại. Mỗi khi client gửi yêu cầu đến server, token sẽ được đính kèm và server sẽ xác minh tính hợp lệ của token để cho phép hoặc từ chối truy cập tài nguyên tương ứng.
module.exports = sendShopToken;
