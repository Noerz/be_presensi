const { Register, Login, ResetPassword } = require('../controller/authController');

const authRoutes = (router) => {
  router.post("/register", Register);
  router.post("/login", Login);
  router.post("/reset", ResetPassword);
};

module.exports = { authRoutes };
