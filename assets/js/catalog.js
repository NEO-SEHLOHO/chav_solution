(function () {
  const products = Array.isArray(window.productsData) ? window.productsData : [];
  const grid = document.getElementById("catalogGrid");
  const filters = Array.from(document.querySelectorAll("[data-catalog-filter]"));
  const homePage = window.location.protocol === "file:" ? "index.html" : "index.php";
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

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (match) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[match];
    });
  }

  let catalogOverrides = {};

  function mergedProduct(item) {
    const override = catalogOverrides[item.id] || {};
    return {
      ...item,
      mockPrice: override.price || defaultPrices[item.id] || "Price on request",
      visible: override.visible !== false,
    };
  }

  function visibleProducts() {
    return products.map(mergedProduct).filter((item) => item.visible);
  }

  function renderCatalog(category) {
    if (!grid) return;
    const activeCategory = category || "All";
    const availableProducts = visibleProducts();
    const items = activeCategory === "All"
      ? availableProducts
      : availableProducts.filter((item) => item.category === activeCategory);

    if (!items.length) {
      grid.innerHTML = '<p class="catalog-empty">No visible products in this category yet.</p>';
      return;
    }

    grid.innerHTML = items.map(function (item) {
      const features = Array.isArray(item.features)
        ? item.features.slice(0, 3).map((feature) => `<span>${escapeHtml(feature)}</span>`).join("")
        : "";
      return `
        <article class="catalog-card" id="${escapeHtml(item.id)}">
          <div class="catalog-card-media">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
            <span>${escapeHtml(item.category)}</span>
          </div>
          <div class="catalog-card-body">
            <div class="catalog-price-row">
              <h3>${escapeHtml(item.title)}</h3>
              <strong>${escapeHtml(item.mockPrice)}</strong>
            </div>
            <p>${escapeHtml(item.shortDescription)}</p>
            ${features ? `<div class="catalog-features">${features}</div>` : ""}
            <small>Mock price for planning only. Final quote may change after specs are confirmed.</small>
            <a href="${homePage}#quote">Request Final Quote</a>
          </div>
        </article>`;
    }).join("");
  }

  filters.forEach(function (filter) {
    filter.addEventListener("click", function () {
      filters.forEach((button) => button.classList.toggle("active", button === filter));
      renderCatalog(filter.getAttribute("data-catalog-filter"));
    });
  });

  async function loadCatalogOverrides() {
    if (window.location.protocol === "file:") {
      renderCatalog("All");
      return;
    }

    try {
      const response = await fetch("backend/catalog_overrides.php", { credentials: "same-origin" });
      const result = await response.json();
      if (response.ok && result.success && result.overrides) {
        catalogOverrides = result.overrides;
      }
    } catch (error) {
      catalogOverrides = {};
    }

    renderCatalog("All");
  }

  loadCatalogOverrides();
})();
