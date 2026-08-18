import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../api/auth";

import "./LoginPage.css";

import passIcon from "../assets/icons/pass.png";
import emailIcon from "../assets/icons/email.png";

function LoginPage() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();


  // ===============================
  // LOGIN
  // ===============================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {

      const data = await loginUser(
        email,
        password
      );


      if (data.success) {

        // Save logged-in user
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );


        // Go to landing page
        navigate("/");

      } else {

        alert(
          data.message ||
          "Invalid credentials."
        );

      }

    } catch (error) {

      console.error(
        "Login error:",
        error
      );


      if (error.response) {

        alert(
          error.response.data.message ||
          "Invalid email or password."
        );

      } else {

        alert(
          "Unable to connect to the server."
        );

      }

    } finally {

      setLoading(false);

    }

  };


  return (

    <div className="login-page">


      {/* ================= LEFT HERO ================= */}

      <section className="login-hero-section">

        <div className="login-hero-overlay"></div>


        <div className="login-hero-content">


          {/* Logo */}

          <Link
            to="/"
            className="login-logo"
          >

            <span className="login-logo-icon">
              🌱
            </span>

            <span>
              Krishi Sahayog
            </span>

          </Link>


          {/* Hero Text */}

          <div className="login-hero-text">

            <p className="login-small-heading">
              SMART AGRICULTURE • BETTER FUTURE
            </p>


            <h1>

              Empowering Farmers,

              <span>
                Growing Tomorrow.
              </span>

            </h1>


            <p>
              Your trusted digital companion
              for smarter farming, agricultural
              knowledge, and better crop decisions.
            </p>

          </div>


          {/* Features */}

          <div className="login-hero-bottom">


            <div className="login-stat">

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


            <div className="login-stat">

              <strong>
                🌿
              </strong>

              <div>

                <b>
                  Healthy Crops
                </b>

                <span>
                  Better harvests
                </span>

              </div>

            </div>


          </div>


        </div>

      </section>


      {/* ================= LOGIN FORM ================= */}

      <section className="login-form-section">

        <div className="login-card">


          {/* Mobile Logo */}

          <div className="login-mobile-logo">

            <span>
              🌱
            </span>

            <strong>
              Krishi Sahayog
            </strong>

          </div>


          {/* Header */}

          <div className="login-header">

            <span className="login-welcome-badge">
              Welcome back 🌿
            </span>


            <h2>
              Login to your account
            </h2>


            <p>
              Continue your journey towards
              smarter farming.
            </p>

          </div>


          {/* Form */}

          <form onSubmit={handleSubmit}>


            {/* EMAIL */}

            <div className="login-form-group">

              <label htmlFor="email">
                Email address
              </label>


              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  <img src={emailIcon} alt="" />
                </span>


                <input
                  id="email"
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


            {/* PASSWORD */}

            <div className="login-form-group">

              <div className="login-label-row">

                <label htmlFor="password">
                  Password
                </label>


                <button
                  type="button"
                  className="login-forgot-button"
                  onClick={() =>
                    alert(
                      "Password recovery will be added later."
                    )
                  }
                >
                  Forgot password?
                </button>

              </div>


              <div className="login-input-wrapper">

                <span className="login-input-icon">
                  <img src={passIcon} alt="" />
                </span>


                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />


                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword
                    ? "🙈"
                    : "👁"}
                </button>

              </div>

            </div>


            {/* REMEMBER ME */}

            <div className="login-remember-row">

              <label className="login-remember">

                <input
                  type="checkbox"
                />

                <span>
                  Remember me
                </span>

              </label>

            </div>


            {/* LOGIN BUTTON */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              <span>

                {loading
                  ? "Logging in..."
                  : "Login"}

              </span>


              {!loading && (

                <span className="login-button-arrow">
                  →
                </span>

              )}

            </button>


          </form>


          {/* Divider */}

          <div className="login-divider">

            <span>
              OR
            </span>

          </div>


          {/* Signup */}

          <p className="login-register-text">

            Don't have an account?

            {" "}

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


export default LoginPage;