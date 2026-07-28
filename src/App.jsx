import { Routes, Route } from "react-router-dom";
import About from "./pages/About/About";
import Layout from "./layout/Layout";
import Home from "./pages/Home/Home";
import Shop from "./pages/Shop/Shop";
import Cart from "./pages/Cart/Cart";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Shipping from "./pages/Shipping/Shipping";
import ScrollToTop from "./components/ScrollToTop";
import Favorites from "./pages/Favorites/Favorites";
import Checkout from "./pages/Checkout/Checkout";
import OrderSuccess from "./pages/OrderSuccess/OrderSuccess";
function App() {
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
        <Route path="/order-success" element={<OrderSuccess/>} />

        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />
      </Routes>
    </Layout>
  );
}

export default App;