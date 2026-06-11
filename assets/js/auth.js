(function () {
  function setStatus(element, message, isError) {
    if (!element) return;
    element.textContent = message;
    element.style.color = isError ? "#b42f2f" : "#1f8a4d";
  }

  async function submitAuthForm(form, statusElement) {
    const submit = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    if (submit) submit.disabled = true;
    setStatus(statusElement, "Please wait...", false);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        credentials: "same-origin",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Request failed.");
      }
      setStatus(statusElement, result.message || "Success.", false);
      window.location.href = result.redirect || "account.php";
    } catch (error) {
      setStatus(statusElement, error.message || "Something went wrong.", true);
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitAuthForm(loginForm, document.getElementById("loginStatus"));
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitAuthForm(registerForm, document.getElementById("registerStatus"));
    });
  }
})();
