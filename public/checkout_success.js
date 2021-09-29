//session id from url
let url = new URL(window.location);
let params = new URLSearchParams(url.search);
let sessionId = params.get("session_id");

const verify = async () => {
  try {
    const response = await fetch("/api/session/verify/" + sessionId, {
      method: "POST",
    });
    const isVerified = await response.json();
    console.log(isVerified);
  } catch (err) {
    console.log(err);
  }
};

verify();
