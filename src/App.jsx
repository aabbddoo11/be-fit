import { Routes, Route } from "react-router-dom";
import About from "./pages/About/About";
import Layout from "./layout/Layout";
import SessionExpiredModal from "./components/SessionExpiredModal/SessionExpiredModal";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Login from "./pages/Login/Login";
import Orders from "./pages/Orders/Orders";
import ForgotPassword from "./pages/Login/ForgotPassword";
import Cart from "./pages/Cart/Cart";
import Register from "./pages/Login/Register";
import { useEffect, useState } from "react";
import SplashLoader from "./components/SplashLoader/SplashLoader";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shipping from "./pages/Shipping/Shipping";
import ScrollToTop from "./components/ScrollToTop";
import Favorites from "./pages/Favorites/Favorites";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);
  if (loading) {
    return <SplashLoader />;
  }
  return (

    <Layout>
      <ScrollToTop />

      <Routes><Route
        path="/checkout"
        element={<Checkout />}
      />
        <Route
          path="/favorites"
          element={<Favorites />}
        />
        <Route path="/shipping"
          element={<Shipping />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />

        <Route path="/shop" element={<Shop />} />
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />
      </Routes>
      <SessionExpiredModal />

    </Layout>
  );
}

export default App;