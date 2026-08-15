import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Login logic will be added here later
    console.log("Login submitted");

    // Example:
    // navigate("/dashboard");
  };

  return (
    <div className="login-page">

      {/* ================= LEFT HERO SECTION ================= */}

      <section className="hero-section">
        <div className="hero-overlay"></div>

        <div className="hero-content">

          {/* Logo */}
          <Link to="/" className="logo logo-link">
            <span className="logo-icon">🌱</span>
            <span>Krishi Sahayog</span>
          </Link>


          {/* Hero Text */}
          <div className="hero-text">

            <p className="small-heading">
              SMART AGRICULTURE • BETTER FUTURE
            </p>

            <h1>
              Empowering Farmers,
              <span>Growing Tomorrow.</span>
            </h1>

            <p>
              Your trusted digital companion for smarter farming,
              agricultural knowledge, and better crop decisions.
            </p>

          </div>


          {/* Hero Features */}
          <div className="hero-bottom">

            <div className="stat">

              <strong>🌾</strong>

              <div>
                <b>Smart Farming</b>
                <span>Better decisions</span>
              </div>

            </div>


            <div className="stat">

              <strong>🌿</strong>

              <div>
                <b>Healthy Crops</b>
                <span>Better harvests</span>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ================= LOGIN SECTION ================= */}

      <section className="login-section">

        <div className="login-card">

          {/* Mobile Logo */}
          <div className="mobile-logo">
            <span>🌱</span>
            <strong>Krishi Sahayog</strong>
          </div>


          {/* Header */}
          <div className="login-header">

            <span className="welcome-badge">
              Welcome back 🌿
            </span>

            <h2>
              Login to your account
            </h2>

            <p>
              Continue your journey towards smarter farming.
            </p>

          </div>


          {/* Login Form */}
          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="form-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />

              </div>

            </div>


            {/* Password */}
            <div className="form-group">

              <div className="label-row">

                <label htmlFor="password">
                  Password
                </label>

                <a
                  href="#"
                  className="forgot-password"
                  onClick={(e) => e.preventDefault()}
                >
                  Forgot password?
                </a>

              </div>


              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>


            {/* Remember Me */}
            <div className="remember-row">

              <label className="remember">

                <input type="checkbox" />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* Login Button */}
            <button
              type="submit"
              className="login-button"
            >
              <span>Login</span>
              <span className="button-arrow">→</span>
            </button>

          </form>


          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>


          {/* Signup Link */}
          <p className="register-text">

            Don't have an account?

            <Link to="/signup">
              Create an account
            </Link>

          </p>


          {/* Footer */}
          <p className="login-footer">
            🌱 Growing together for a better tomorrow
          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;