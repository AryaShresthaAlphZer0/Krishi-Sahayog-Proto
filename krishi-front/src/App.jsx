import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";

import Navbar from "./components/Navbar";


// =========================================================
// APP CONTENT
// =========================================================

function AppContent() {

  const location = useLocation();


  // Hide navbar/taskbar on authentication pages
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup";


  return (
    <>
      {/* =========================================
          NAVBAR / VERTICAL TASKBAR
          Hidden on Login and Signup
      ========================================= */}

      {!hideNavbar && <Navbar />}


      {/* =========================================
          ROUTES
      ========================================= */}

      <Routes>

        <Route
          path="/"
          element={<LandingPage />}
        />

        <Route
          path="/login"
          element={<LoginPage />}
        />

        <Route
          path="/signup"
          element={<SignupPage />}
        />

        <Route
          path="/dashboard"
          element={<DashboardPage />}
        />

      </Routes>

    </>
  );
}


// =========================================================
// APP
// =========================================================

export default function App() {

  return (
    <BrowserRouter>

      <AppContent />

    </BrowserRouter>
  );
}