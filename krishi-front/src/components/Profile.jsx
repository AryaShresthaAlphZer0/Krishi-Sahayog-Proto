import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Profile.module.css";

export default function Profile({ collapsed }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const getUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        return JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Could not read user:", error);
    }

    return null;
  };

  const user = getUser();

  /* =========================================
     LOGGED OUT
  ========================================= */

  if (!user) {
    return (
      <button
        type="button"
        className={[
          styles.loginButton,
          collapsed ? styles.loginButtonCollapsed : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={() => navigate("/login")}
        title="Login"
      >
        <span className={styles.loginIcon}>
          🔑
        </span>

        <span className={styles.loginText}>
          Login
        </span>
      </button>
    );
  }


  /* =========================================
     LOGGED IN
  ========================================= */

  const firstLetter =
    user?.name?.charAt(0)?.toUpperCase() || "U";


  const logout = () => {
    localStorage.removeItem("user");

    setIsOpen(false);

    window.location.href = "/";
  };


  return (
    <div
      className={[
        styles.profileContainer,
        collapsed ? styles.profileCollapsed : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >

      {/* PROFILE BUTTON */}

      <button
        type="button"
        className={styles.profileButton}
        onClick={() =>
          setIsOpen((value) => !value)
        }
        title={collapsed ? user.name : undefined}
      >

        <div className={styles.profilePicture}>
          {firstLetter}
        </div>

        <span className={styles.profileName}>
          {user.name}
        </span>

        <span className={styles.arrow}>
          {isOpen ? "▲" : "▼"}
        </span>

      </button>


      {/* PROFILE DROPDOWN */}

      {isOpen && (
        <div className={styles.dropdown}>

          <div className={styles.largeProfilePicture}>
            {firstLetter}
          </div>

          <h3 className={styles.userName}>
            {user.name}
          </h3>

          <p className={styles.userEmail}>
            {user.email}
          </p>

          <div className={styles.profileDivider} />

          {/* Future profile fields */}
          <div className={styles.extraFields}>
          </div>

          <button
            type="button"
            className={styles.logoutButton}
            onClick={logout}
          >
            Logout
          </button>

        </div>
      )}

    </div>
  );
}