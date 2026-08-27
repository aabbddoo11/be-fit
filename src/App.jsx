import NotFound from "./pages/NotFound/NotFound";
import { Routes, Route } from "react-router-dom";
import AdminNotifications from "./pages/Admin/pages/AdminNotifications";
import About from "./pages/About/About";
import Layout from "./layout/Layout";
import SessionExpiredModal from "./components/SessionExpiredModal/SessionExpiredModal.jsx";
import AdminUsers from "./pages/Admin/pages/AdminUsers.jsx";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Login from "./pages/Login/Login";
import Register from "./pages/Login/Register";
import ForgotPassword from "./pages/Login/ForgotPassword";

import OrderDetails from "./pages/OrderDetails/OrderDetails";
import Orders from "./pages/Orders/Orders";
import Profile from "./pages/Profile/Profile";
import Cart from "./pages/Cart/Cart";
import Favorites from "./pages/Favorites/Favorites";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shipping from "./pages/Shipping/Shipping";

import Admin from "./pages/Admin/Admin";
import Dashboard from "./pages/Admin/pages/Dashboard.jsx";
import AdminProducts from "./pages/Admin/pages/AdminProducts.jsx";
import AdminOrders from "./pages/Admin/pages/AdminOrders.jsx";
import ScrollToTop from "./components/ScrollToTop";
import SplashLoader from "./components/SplashLoader/SplashLoader";

import { useEffect, useState } from "react";

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
    <>
      <ScrollToTop />

      <Routes>
        <Route path="/admin" element={<Admin />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route
  path="notifications"
  element={<AdminNotifications />}
/>
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />

        <Route
          path="/shop"
          element={
            <Layout>
              <Shop />
            </Layout>
          }
        />

        <Route
          path="/product/:id"
          element={
            <Layout>
              <ProductDetails />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/forgotPassword"
          element={
            <Layout>
              <ForgotPassword />
            </Layout>
          }
        />

        <Route
          path="/account"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />

        <Route
          path="/favorites"
          element={
            <Layout>
              <Favorites />
            </Layout>
          }
        />

        <Route
          path="/cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        />

        <Route
          path="/checkout"
          element={
            <Layout>
              <Checkout />
            </Layout>
          }
        />

        <Route
          path="/shipping"
          element={
            <Layout>
              <Shipping />
            </Layout>
          }
        />

        <Route
          path="/order-success"
          element={
            <Layout>
              <OrderSuccess />
            </Layout>
          }
        />

        <Route
          path="/orders"
          element={
            <Layout>
              <Orders />
            </Layout>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <Layout>
              <OrderDetails />
            </Layout>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <SessionExpiredModal />
    </>
  );
}

export default App;
