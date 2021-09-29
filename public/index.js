const productsDB = {
  produkt1: {
    images: "iphone12.png",
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
    images: "iphone12.png",
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

const transformToCommaSeparator = (number) => {
  return number.toString().replace(".", ",");
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

function renderProducts() {
  let mainContent = document.getElementById("mainContent");
  let greyBackground = true;
  Object.entries(productsDB).map((e) => {
    console.log(e);

    let mainContainer = document.createElement("div");
    mainContainer.id = "mainContainer";
    if (greyBackground == true) {
      mainContainer.classList = "mainContainerGrey";
    }
    greyBackground = !greyBackground;

    let titleContainer = document.createElement("div");
    titleContainer.id = "titleContainer";
    titleContainer.innerText = e[0];

    let descriptionContainer = document.createElement("div");
    descriptionContainer.id = "descriptionContainer";
    descriptionContainer.innerText = e[1].description;

    let imgContainer = document.createElement("img");
    imgContainer.id = "imgContainer";
    imgContainer.src = e[1].images;

    let priceContainer = document.createElement("div");
    priceContainer.id = "priceContainer";
    priceContainer.innerHTML =
      transformToCommaSeparator(
        (Math.round(e[1].price_data.unit_amount) / 100).toFixed(2)
      ) +
      " " +
      "kr";

    let cartIcon = document.createElement("i");
    cartIcon.classList = "fas fa-cart-arrow-down";

    let buyButton = document.createElement("button");
    buyButton.id = "buyButton";
    buyButton.addEventListener("click", () => addProduct(e[0]));

    let buyBtnTxt = document.createElement("p");
    buyBtnTxt.innerHTML = "Lägg till i kundvagnen";

    mainContainer.appendChild(titleContainer);
    mainContainer.appendChild(descriptionContainer);
    mainContainer.appendChild(imgContainer);
    mainContainer.appendChild(priceContainer);
    buyButton.appendChild(cartIcon);
    mainContainer.appendChild(buyButton);
    buyButton.appendChild(buyBtnTxt);
    mainContent.appendChild(mainContainer);
  });
}

/* const verify = async () => {
  try {
    const sessionId = localStorage.getItem("session");
    if (!sessionId) {
      throw new Error("No session id to verify");
    }

    const response = await fetch("/api/session/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
      }),
    });
    const { paid } = await response.json();
    return paid;
  } catch (err) {
    console.log(err);
    return false;
  }
};

async function main() {
  renderProducts();
  const isVerified = await verify();
  console.log(isVerified);

  if (localStorage.getItem("session")) {
    if (isVerified) {
      alert("Tack för ditt köp");
      localStorage.removeItem("cart");
    } else {
      alert(
        "Köp avbrutet. Sessionen tas bort men produkterna är kvar i localstorage"
      );
    }
    localStorage.removeItem("session");
  }
}

main();
 */

renderProducts();
