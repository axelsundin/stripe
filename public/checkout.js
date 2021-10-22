let stripe = Stripe(
  "pk_test_51Jc4KdBqFnPYjqEIopFvmNb9kp5kAmfTxv3hlwH6u0gd4ofiFS30hOPyZcxm83bIUFLoubhmKGVDxNIrB62DaHd700QGrOiMlc"
);

const transformToCommaSeparator = (number) => {
  return number.toString().replace(".", ",");
};

const cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);
console.log();
const containerDiv = document.getElementById("containerDiv");

if (cart == null || Object.keys(cart).length < 1) {
  const title = document.getElementById("summa");
  title.innerText = "Din varukorg är tom";
  const button = document.getElementById("checkOutBtn");
  button.innerText = "Tillbaka till startsidan";
  button.addEventListener("click", () => {
    window.location.href = "http://localhost:3000";
  });
} else {
  const cartHasProducts = document.getElementById("cartHasProducts");
  cartHasProducts.style.display = "flex";
  const productsTotalPrice = document.getElementById("summa");
  let totalPrice = 0;

  Object.entries(cart).map((e) => {
    totalPrice = totalPrice + e[1].price_data.unit_amount * e[1].quantity;
    console.log(e);

    let indexContainer = document.getElementById("index");
    let textContainer = document.createElement("div");
    let imgContainer = document.createElement("div");

    let cardContainer = document.createElement("div");
    cardContainer.className = "cardContainer";
    cardContainer.id = "cardContainer";

    const productImg = document.createElement("img");
    productImg.src = e[1].images;

    /* containerDiv.appendChild(productImg); */

    const productTitle = document.createElement("h1");
    productTitle.innerText = e[0];

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

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "deleteBtn";
    deleteBtn.innerText = "Ta bort";
    deleteBtn.addEventListener("click", () => {
      delete cart[e[0]];
      localStorage.setItem("cart", JSON.stringify(cart));
      location.reload();
    });

    imgContainer.className = "imgContainer";
    textContainer.className = "textContainer";
    productImg.className = "productImg";

    indexContainer.appendChild(cardContainer);
    textContainer.appendChild(productTitle);
    cardContainer.appendChild(imgContainer);
    imgContainer.appendChild(productImg);
    cardContainer.appendChild(textContainer);

    textContainer.appendChild(productPrice);

    /* containerDiv.appendChild(productName); */
    /* containerDiv.appendChild(productPrice); */
    /*  containerDiv.appendChild(productDescription); */
    textContainer.appendChild(productQuantity);
    textContainer.appendChild(deleteBtn);
    /* containerDiv.appendChild(separationLine); */
    console.log(e);

    /* delete e[1].images; */
  });

  productsTotalPrice.innerText =
    "Summa: " +
    transformToCommaSeparator((Math.round(totalPrice) / 100).toFixed(2)) +
    " SEK";
  /* containerDiv.appendChild(productsTotalPrice); */

  const checkoutBtn = document.getElementById("checkOutBtn");
  checkoutBtn.innerText = "Gå vidare till kassan";
  checkoutBtn.addEventListener("click", () => checkout());
  /* containerDiv.appendChild(checkoutBtn); */
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
