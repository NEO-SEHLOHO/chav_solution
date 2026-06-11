(function () {
  const storageKey = "chavDemoUser";

  function setStatus(element, message, isError) {
    if (!element) return;
    element.textContent = message;
    element.style.color = isError ? "#b42f2f" : "#1f8a4d";
  }

  function fieldValue(form, name) {
    const field = form.querySelector(`[name="${name}"]`);
    return field ? field.value.trim() : "";
  }

  function setInvalid(field, isInvalid) {
    if (field) field.classList.toggle("invalid", isInvalid);
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateRequiredFields(form, names) {
    let valid = true;

    names.forEach(function (name) {
      const field = form.querySelector(`[name="${name}"]`);
      const value = fieldValue(form, name);
      const fieldValid = field && value.length > 0 && (field.type !== "email" || validateEmail(value));
      setInvalid(field, !fieldValid);
      if (!fieldValid) valid = false;
    });

    return valid;
  }

  function submitLogin(form, statusElement) {
    if (!validateRequiredFields(form, ["email", "password"])) {
      setStatus(statusElement, "Please enter a valid email address and password.", true);
      return;
    }

    const savedUser = JSON.parse(localStorage.getItem(storageKey) || "null");
    const email = fieldValue(form, "email");
    const name = savedUser && savedUser.email === email ? savedUser.name : "client";
    setStatus(statusElement, `Demo login successful. Welcome, ${name}.`, false);
  }

  function submitRegister(form, statusElement) {
    if (!validateRequiredFields(form, ["name", "email", "password", "confirm_password"])) {
      setStatus(statusElement, "Please complete the required fields correctly.", true);
      return;
    }

    const password = fieldValue(form, "password");
    const confirmPassword = fieldValue(form, "confirm_password");
    const passwordField = form.querySelector('[name="password"]');
    const confirmField = form.querySelector('[name="confirm_password"]');

    if (password.length < 8) {
      setInvalid(passwordField, true);
      setStatus(statusElement, "Password must be at least 8 characters.", true);
      return;
    }

    if (password !== confirmPassword) {
      setInvalid(confirmField, true);
      setStatus(statusElement, "Passwords do not match.", true);
      return;
    }

    const demoUser = {
      name: fieldValue(form, "name"),
      email: fieldValue(form, "email"),
      phone: fieldValue(form, "phone")
    };
    localStorage.setItem(storageKey, JSON.stringify(demoUser));
    setStatus(statusElement, "Demo account created. You can now use the login concept.", false);
  }

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitLogin(loginForm, document.getElementById("loginStatus"));
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitRegister(registerForm, document.getElementById("registerStatus"));
    });
  }
})();
