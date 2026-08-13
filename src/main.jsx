import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; 
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import "./styles/global.css";
import { FavoriteProvider } from "./context/FavoriteContext";
import ScrollToTop from "./components/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>

  <BrowserRouter>

    <FavoriteProvider>

      <CartProvider>

        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light"
        />
      </CartProvider>

    </FavoriteProvider>

  </BrowserRouter>
  </AuthProvider>
);