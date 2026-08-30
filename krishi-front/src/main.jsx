import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import CartDrawer from "./components/CartDrawer";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <App />
          <CartDrawer />
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
);