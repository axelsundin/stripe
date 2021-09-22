const btn1 = document.getElementById("makePurchase1");
btn1.addEventListener("click", () => addProduct("produkt1"));

const btn2 = document.getElementById("makePurchase2");
btn2.addEventListener("click", () => addProduct("produkt2"));

const productsDB = {
  produkt1: {
    description: "En produktbeskrivning",
    price_data: {
      currency: "sek",
      product_data: {
        name: "Produktnamn 1",
      },
      unit_amount: 9000,
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
  localStorage.setItem("cart", JSON.stringify(cart));
};
