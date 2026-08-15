import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const navigate = useNavigate();


  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Signup submitted");

    // Later you can send the data to your backend here.

    // After successful signup:
    navigate("/");
  };


  return (
    <div className="login-page">

      {/* ================= LEFT HERO SECTION ================= */}

      <section className="hero-section">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          {/* Logo */}
          <Link to="/" className="logo logo-link">

            <span className="logo-icon">
              🌱
            </span>

            <span>
              Krishi Sahayog
            </span>

          </Link>


          {/* Hero Text */}
          <div className="hero-text">

            <p className="small-heading">
              SMART AGRICULTURE • BETTER FUTURE
            </p>

            <h1>
              Grow With Us,
              <span>Grow With Nature.</span>
            </h1>

            <p>
              Join Krishi Sahayog and get access to tools,
              knowledge, and resources designed to make
              farming smarter and easier.
            </p>

          </div>


          {/* Hero Features */}
          <div className="hero-bottom">

            <div className="stat">

              <strong>
                🌾
              </strong>

              <div>
                <b>
                  Smart Farming
                </b>

                <span>
                  Better decisions
                </span>
              </div>

            </div>


            <div className="stat">

              <strong>
                🤝
              </strong>

              <div>
                <b>
                  Farmer Community
                </b>

                <span>
                  Grow together
                </span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ================= SIGNUP SECTION ================= */}

      <section className="login-section">

        <div className="login-card signup-card">

          {/* Mobile Logo */}
          <div className="mobile-logo">

            <span>
              🌱
            </span>

            <strong>
              Krishi Sahayog
            </strong>

          </div>


          {/* Header */}
          <div className="login-header">

            <span className="welcome-badge">
              Join Krishi Sahayog 🌱
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Start your journey towards smarter farming.
            </p>

          </div>


          {/* Signup Form */}
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">

              <label htmlFor="name">
                Full name
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  required
                />

              </div>

            </div>


            {/* Email */}
            <div className="form-group">

              <label htmlFor="signup-email">
                Email address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  ✉
                </span>

                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />

              </div>

            </div>


            {/* Password */}
            <div className="form-group">

              <label htmlFor="signup-password">
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔒
                </span>

                <input
                  id="signup-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Create a password"
                  minLength="8"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
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


            {/* Confirm Password */}
            <div className="form-group">

              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔐
                </span>

                <input
                  id="confirm-password"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Confirm your password"
                  minLength="8"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* Terms */}
            <div className="remember-row">

              <label className="remember">

                <input
                  type="checkbox"
                  required
                />

                <span>
                  I agree to the terms and conditions
                </span>

              </label>

            </div>


            {/* Signup Button */}
            <button
              type="submit"
              className="login-button"
            >

              <span>
                Create Account
              </span>

              <span className="button-arrow">
                →
              </span>

            </button>

          </form>


          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>


          {/* Login Link */}
          <p className="register-text">

            Already have an account?

            <Link to="/">
              Login
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

export default Signup;