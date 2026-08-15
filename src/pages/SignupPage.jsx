import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./SignupPage.css";

function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
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

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);

    // Backend signup will be added later.

    alert("Account created successfully!");

    // Go to login after successful signup
    navigate("/login");
  };


  return (
    <div className="signup-page">

      {/* ================= LEFT HERO ================= */}

      <section className="signup-hero-section">

        <div className="signup-hero-overlay"></div>

        <div className="signup-hero-content">

          {/* Logo */}
          <Link to="/" className="signup-logo">

            <span className="signup-logo-icon">
              🌱
            </span>

            <span>
              Krishi Sahayog
            </span>

          </Link>


          {/* Hero Text */}
          <div className="signup-hero-text">

            <p className="signup-small-heading">
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


          {/* Features */}
          <div className="signup-hero-bottom">

            <div className="signup-stat">

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


            <div className="signup-stat">

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


      {/* ================= SIGNUP FORM ================= */}

      <section className="signup-form-section">

        <div className="signup-card">

          {/* Mobile Logo */}
          <div className="signup-mobile-logo">

            <span>
              🌱
            </span>

            <strong>
              Krishi Sahayog
            </strong>

          </div>


          {/* Header */}
          <div className="signup-header">

            <span className="signup-welcome-badge">
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
            <div className="signup-form-group">

              <label htmlFor="name">
                Full name
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  👤
                </span>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* Email */}
            <div className="signup-form-group">

              <label htmlFor="signup-email">
                Email address
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
                  ✉
                </span>

                <input
                  id="signup-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  required
                />

              </div>

            </div>


            {/* Password */}
            <div className="signup-form-group">

              <label htmlFor="signup-password">
                Password
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
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
                  className="signup-password-toggle"
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
            <div className="signup-form-group">

              <label htmlFor="confirm-password">
                Confirm password
              </label>

              <div className="signup-input-wrapper">

                <span className="signup-input-icon">
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
                    setConfirmPassword(e.target.value)
                  }
                  required
                />

                <button
                  type="button"
                  className="signup-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* Terms */}
            <div className="signup-remember-row">

              <label className="signup-remember">

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
              className="signup-button"
            >

              <span>
                Create Account
              </span>

              <span className="signup-button-arrow">
                →
              </span>

            </button>

          </form>


          {/* Divider */}
          <div className="signup-divider">
            <span>OR</span>
          </div>


          {/* Login */}
          <p className="signup-register-text">

            Already have an account?

            <Link to="/login">
              Login
            </Link>

          </p>


          {/* Footer */}
          <p className="signup-footer">
            🌱 Growing together for a better tomorrow
          </p>

        </div>

      </section>

    </div>
  );
}

export default SignupPage;