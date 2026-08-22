import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCurrentUser } from "../api/auth";

export default function DashboardPage() {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function loadUser() {

      try {

        const data =
          await getCurrentUser();

        setUser(data.user);

      } catch {

        localStorage.removeItem(
          "access_token"
        );

        localStorage.removeItem(
          "refresh_token"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/login");

      } finally {

        setLoading(false);

      }
    }


    loadUser();

  }, [navigate]);


  function logout() {

    localStorage.removeItem(
      "access_token"
    );

    localStorage.removeItem(
      "refresh_token"
    );

    localStorage.removeItem(
      "user"
    );

    navigate("/login");
  }


  if (loading) {
    return <p>Loading...</p>;
  }


  return (
    <div>

      <h1>
        Welcome, {user?.name}
      </h1>

      <p>
        Email: {user?.email}
      </p>

      <button onClick={logout}>
        Logout
      </button>

    </div>
  );
}