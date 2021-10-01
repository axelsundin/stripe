window.onload = () => {
  verify();
};

let url = new URL(window.location);
let params = new URLSearchParams(url.search);
let sessionId = params.get("session_id");
let text = document.getElementById("text");

const verify = async () => {
  try {
    const response = await fetch("/api/session/verify/" + sessionId, {
      method: "POST",
    });
    const isVerified = await response.json();
    if (isVerified.saved) {
      text.innerText = "Tack för ditt köp!";
    } else {
      text.innerText = "Den här ordern är redan lagd.";
    }
  } catch (err) {
    console.log(err);
  }
};
