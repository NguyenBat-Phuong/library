const server = require("../connect/server.js");
const { loginUser } = require("./log-in");

// API Endpoint cho đăng nhập
server.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Vui lòng nhap lai tài khoản và mật khẩu.",
    });
  }

  //kiểm tra thông tin đăng nhập
  const result = await loginUser(username, password);

  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(401).json(result);
  }
});
