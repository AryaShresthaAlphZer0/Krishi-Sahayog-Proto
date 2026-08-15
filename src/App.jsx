import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={<LandingPage />}
        />


        {/* Login */}
        <Route
          path="/login"
          element={<LoginPage />}
        />


        {/* Signup */}
        <Route
          path="/signup"
          element={<SignupPage />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;