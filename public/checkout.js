let stripe = Stripe(
  "pk_test_51Jc4KdBqFnPYjqEIopFvmNb9kp5kAmfTxv3hlwH6u0gd4ofiFS30hOPyZcxm83bIUFLoubhmKGVDxNIrB62DaHd700QGrOiMlc"
);

const transformToCommaSeparator = (number) => {
  return number.toString().replace(".", ",");
};

const cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);
const containerDiv = document.getElementById("containerDiv");

if (cart == null) {
  const emptyCart = document.createElement("h3");
  emptyCart.innerText = "Din varukorg är tom.";
  const returnToStartBtn = document.createElement("button");
  returnToStartBtn.innerText = "Tillbaka till startsidan";
  returnToStartBtn.addEventListener("click", () => {
    window.location.href = "http://localhost:3000";
  });
  containerDiv.appendChild(emptyCart);
  containerDiv.appendChild(returnToStartBtn);
} else {
  const productsTotalPrice = document.createElement("h3");
  let totalPrice = 0;

  Object.entries(cart).map((e) => {
    totalPrice = totalPrice + e[1].price_data.unit_amount * e[1].quantity;
    console.log(e);
    const productImg = document.createElement("img");
    productImg.src = e[1].images;
    containerDiv.appendChild(productImg);
    const productName = document.createElement("h3");
    productName.innerText = e[0];
    const productDescription = document.createElement("p");
    productDescription.innerText = e[1].description;
    const productPrice = document.createElement("h4");
    productPrice.innerText =
      transformToCommaSeparator(
        (Math.round(e[1].price_data.unit_amount) / 100).toFixed(2)
      ) + " SEK";
    const productQuantity = document.createElement("h4");
    productQuantity.innerText = "Antal: " + e[1].quantity;
    const separationLine = document.createElement("hr");
    containerDiv.appendChild(productName);
    containerDiv.appendChild(productPrice);
    containerDiv.appendChild(productDescription);
    containerDiv.appendChild(productQuantity);
    containerDiv.appendChild(separationLine);
    console.log(e);
    delete e[1].images;
  });

  productsTotalPrice.innerText =
    "Summa: " +
    transformToCommaSeparator((Math.round(totalPrice) / 100).toFixed(2)) +
    " SEK";
  containerDiv.appendChild(productsTotalPrice);

  const checkoutBtn = document.createElement("button");
  checkoutBtn.innerText = "Gå vidare till kassan";
  checkoutBtn.addEventListener("click", () => checkout());
  containerDiv.appendChild(checkoutBtn);
}

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
