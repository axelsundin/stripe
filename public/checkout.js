let stripe = Stripe(
  "pk_test_51Jc4KdBqFnPYjqEIopFvmNb9kp5kAmfTxv3hlwH6u0gd4ofiFS30hOPyZcxm83bIUFLoubhmKGVDxNIrB62DaHd700QGrOiMlc"
);

const cart = JSON.parse(localStorage.getItem("cart"));
console.log(cart);

const btnCart = document.getElementById("cart");
btnCart.addEventListener("click", () => checkout());

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
