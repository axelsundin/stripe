let stripe = Stripe(
  "pk_test_51Jc4KdBqFnPYjqEIopFvmNb9kp5kAmfTxv3hlwH6u0gd4ofiFS30hOPyZcxm83bIUFLoubhmKGVDxNIrB62DaHd700QGrOiMlc"
);

const btn1 = document.getElementById("makePurchase1");
btn1.addEventListener("click", () => addProduct("produkt1"));

const btn2 = document.getElementById("makePurchase2");
btn2.addEventListener("click", () => addProduct("produkt2"));

const btnCart = document.getElementById("cart");
btnCart.addEventListener("click", () => checkout());

const productsDB = {
  produkt1: {
    description: "En produktbeskrivning",
    price_data: {
      currency: "sek",
      product_data: {
        name: "Produktnamn 1",
      },
      unit_amount: 1000,
    },
  },
  produkt2: {
    description: "En annan produktbeskrivning",
    price_data: {
      currency: "sek",
      product_data: {
        name: "Produktnamn 2",
      },
      unit_amount: 4900,
    },
  },
};

let cart = {};

const addProduct = async (productKey) => {
  const product = productsDB[productKey];
  if (!product) {
    throw new Error("Product does not exist");
  }
  cart[productKey] = cart[productKey] || product;
  cart[productKey].quantity = cart[productKey].quantity || 0;
  cart[productKey].quantity++;
  console.log(cart);
};

const checkout = async () => {
  try {
    if (Object.keys(cart).length == 0) {
      throw new Error("No products added");
    }
    const response = await fetch("/api/session/new", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        line_items: Object.values(cart),
      }),
    });
    const { id } = await response.json();
    stripe.redirectToCheckout({ sessionId: id });
  } catch (err) {
    console.log(err);
  }
};
