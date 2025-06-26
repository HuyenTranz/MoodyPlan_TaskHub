import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom"; // Dùng Link nếu bạn dùng React Router

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="login-wrapper page-transition">
      <div className="login-form">
        <h2 className="form-title">Đăng nhập</h2>
        <form>
          <div className="form-group">
            <label className="label">Email</label>
            <input
              type="email"
              placeholder="Nhập email"
              className="input"
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Mật khẩu</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                className="input"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="forgot-password">
            <a href="/forgot-password">Quên mật khẩu?</a>
          </div>

          <button type="submit" className="login-button">
            Đăng nhập
          </button>
        </form>

        <div className="no-account">
          <span>Bạn chưa có tài khoản? </span>
          <Link to="/register">Đăng ký</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
