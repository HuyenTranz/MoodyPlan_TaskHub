import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="register-wrapper page-transition">
      <div className="register-form">
        <h2 className="form-title">Đăng kí </h2>
        <form>
          <div className="form-group">
            <label className="label">Họ tên</label>
            <input type="text" placeholder="Nhập họ tên" className="input" required />
          </div>

          <div className="form-group">
            <label className="label">Email</label>
            <input type="email" placeholder="Nhập email" className="input" required />
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
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="label">Nhập lại mật khẩu</label>
            <div className="password-input-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Xác nhận mật khẩu"
                className="input"
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          <button type="submit" className="register-button">
            Đăng ký
          </button>
        </form>

        <div className="already-account">
          <span>Bạn đã có tài khoản? </span>
          <Link to="/login">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
