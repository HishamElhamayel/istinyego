const getById = (id) => {
  return document.getElementById(id);
};

const password = getById("password");
const confirmPassword = getById("confirm-password");
const form = getById("form");
const container = getById("container");
const loader = getById("loader");
const button = getById("submit");
const error = getById("error");
const success = getById("success");

error.style.display = "none";
success.style.display = "none";
container.style.display = "none";

let token, userId;
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/;

window.addEventListener("DOMContentLoaded", async () => {
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => {
      return searchParams.get(prop);
    },
  });

  token = params.token;
  userId = params.userId;

  console.log(params.token, params.userId);

  const res = await fetch("/auth/verify-pass-reset-token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, userId }),
  });

  if (!res.ok) {
    const { error } = await res.json();
    loader.innerText = error;
    return;
  }

  loader.style.display = "none";
  container.style.display = "block";
});

const displayError = (err) => {
  success.style.display = "none";
  error.innerText = err;
  error.style.display = "block";
};

const displaySuccess = (msg) => {
  error.style.display = "none";
  success.innerText = msg;
  success.style.display = "block";
};

const handleSubmit = async (event) => {
  event.preventDefault();

  if (!password.value.trim()) {
    return displayError("Password is missing");
  }

  if (!passwordRegex.test(password.value)) {
    return displayError(
      "Password must contain at least one letter, one number and one special character"
    );
  }

  if (password.value !== confirmPassword.value) {
    return displayError("Passwords don't match");
  }

  button.disable = true;
  button.innerText = "Please Wait...";

  const res = await fetch("/auth/update-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, userId, password: password.value }),
  });

  button.disable = false;
  button.innerText = "Reset Password";

  if (!res.ok) {
    const { error } = await res.json();
    return displayError(error);
  }

  displaySuccess("Your password has been reset successfully");
  password.value = "";
  confirmPassword.value = "";
};

form.addEventListener("submit", handleSubmit);
