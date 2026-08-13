const API_URL = "https://be-fit-production.up.railway.app/api";

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
};
export const register = async (userData) => {
    const response = await fetch(`${API_URL}/user/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
    }

    return response.json();
};
export const logIn = async (userData) => {
  const response = await fetch(`${API_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};
export const getOrders = async (token) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch orders");
  }

  return data;
};
export const checkout = async (token, orderData) => {
  const response = await fetch(`${API_URL}/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Checkout failed");
  }

  return data;
};
export const getOrderById = async (token, orderId) => {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to fetch order");
  }

  return data;
};

export const cancelOrder = async (token, orderId) => {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to cancel order");
  }

  return data;
};
export const getCart = async (token) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  // الباك إند يرجع 404 إذا لم توجد عربة بعد
  if (response.status === 404) {
    return {
      cart: null,
      products: [],
    };
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch cart"
    );
  }

  return {
    cart: data.yourCart || data.cart || null,
  };
};

export const addCartItem = async (
  token,
  { productId, quantity = 1 }
) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to add product to cart"
    );
  }

  return data;
};

export const updateCartItem = async (
  token,
  productId,
  quantity
) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to update cart"
    );
  }

  return data;
};

export const removeCartItem = async (
  token,
  productId
) => {
  const response = await fetch(
    `${API_URL}/cart/${productId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to remove product from cart"
    );
  }

  return data;
};

export const clearCart = async (token) => {
  const response = await fetch(`${API_URL}/cart`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to clear cart"
    );
  }

  return data;
};