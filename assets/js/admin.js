(function () {
  const defaultPrices = {
    "banners": "From R450",
    "pull-up-banners": "From R1,250",
    "branded-flags": "From R950",
    "gazebos-shades": "From R6,500",
    "banner-walls": "From R2,800",
    "wall-banners": "From R850",
    "billboards": "From R4,500",
    "outdoor-signage": "From R1,800",
    "shop-signage": "From R2,200",
    "fascia-boards": "From R3,500",
    "vehicle-branding": "From R1,500",
    "digital-printing": "From R250",
    "promotional-items": "From R35 each",
    "promotional-gifts": "From R65 each",
    "branded-apparel": "From R180 each",
    "table-cloths": "From R950",
    "events-branding": "From R4,800",
    "exhibition-displays": "From R1,650",
    "it-support": "From R450/hour",
    "network-setup": "From R1,200",
    "website-services": "From R2,500",
    "maintenance-plans": "From R850/month",
    "computer-repairs": "From R350",
    "business-tech-support": "From R1,500/month"
  };
  const products = Array.isArray(window.productsData) ? window.productsData : [];
  const table = document.getElementById("adminCatalogTable");
  const saveButton = document.getElementById("saveCatalogSettings");

  function setStatus(element, message, isError) {
    if (!element) return;
    element.textContent = message;
    element.style.color = isError ? "#b42f2f" : "#1f8a4d";
  }

  async function submitForm(form, statusElement) {
    const submit = form.querySelector('button[type="submit"]');
    if (submit) submit.disabled = true;
    setStatus(statusElement, "Please wait...", false);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        credentials: "same-origin",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Request failed.");
      }
      setStatus(statusElement, result.message || "Success.", false);
      window.location.href = result.redirect || "admin.php";
    } catch (error) {
      setStatus(statusElement, error.message || "Something went wrong.", true);
    } finally {
      if (submit) submit.disabled = false;
    }
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (match) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[match];
    });
  }

  function renderTable(overrides) {
    if (!table) return;
    table.innerHTML = products.map(function (product) {
      const override = overrides[product.id] || {};
      const price = override.price || defaultPrices[product.id] || "Price on request";
      const visible = override.visible !== false;
      return `
        <article class="admin-product-row" data-product-id="${escapeHtml(product.id)}">
          <img src="${escapeHtml(product.image)}" alt="${escapeHtml(product.title)}">
          <div>
            <strong>${escapeHtml(product.title)}</strong>
            <span>${escapeHtml(product.category)}</span>
          </div>
          <label>
            Mock Price
            <input type="text" data-admin-price value="${escapeHtml(price)}">
          </label>
          <label class="admin-visible-toggle">
            <input type="checkbox" data-admin-visible ${visible ? "checked" : ""}>
            Visible
          </label>
        </article>`;
    }).join("");
  }

  async function loadOverrides() {
    if (!table || !window.adminLoggedIn) return;
    try {
      const response = await fetch("backend/admin_catalog.php", { credentials: "same-origin" });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not load catalogue settings.");
      }
      renderTable(result.overrides || {});
    } catch (error) {
      setStatus(document.getElementById("adminCatalogStatus"), error.message, true);
    }
  }

  async function saveOverrides() {
    const status = document.getElementById("adminCatalogStatus");
    const rows = Array.from(document.querySelectorAll(".admin-product-row"));
    const items = rows.map(function (row) {
      return {
        id: row.getAttribute("data-product-id"),
        price: row.querySelector("[data-admin-price]").value.trim(),
        visible: row.querySelector("[data-admin-visible]").checked,
      };
    });

    if (saveButton) saveButton.disabled = true;
    setStatus(status, "Saving...", false);

    try {
      const response = await fetch("backend/admin_catalog.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ items }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Could not save catalogue settings.");
      }
      setStatus(status, result.message || "Saved.", false);
    } catch (error) {
      setStatus(status, error.message, true);
    } finally {
      if (saveButton) saveButton.disabled = false;
    }
  }

  const setupForm = document.getElementById("adminSetupForm");
  const loginForm = document.getElementById("adminLoginForm");

  if (setupForm) {
    setupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitForm(setupForm, document.getElementById("adminSetupStatus"));
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      submitForm(loginForm, document.getElementById("adminLoginStatus"));
    });
  }

  if (saveButton) {
    saveButton.addEventListener("click", saveOverrides);
  }

  loadOverrides();
})();
