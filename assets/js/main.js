(function () {
  const allItems = Array.isArray(window.productsData) ? window.productsData : [];
  const siteEmail = "hello@chavsolutions.co.za";
  const navItems = [
    { label: "Home", href: "index.html#home", section: "#home" },
    { label: "About", href: "index.html#about", section: "#about" },
    { label: "Printing", href: "branding.html" },
    { label: "IT", href: "it.html" },
    { label: "Security", href: "surveillance.html" },
    { label: "Products", href: "products.html" },
    { label: "Why Us", href: "index.html#why-us", section: "#why-us" },
    { label: "Quote", href: "index.html#quote", section: "#quote" },
    { label: "Login", href: "login.html" }
  ];

  const state = { activeFilter: "All", activeItemId: allItems[0]?.id || null };
  const categories = ["All", "Printing & Branding", "IT Services"];
  const featuredAccordionIds = [
    "banners",
    "gazebos-shades",
    "shop-signage",
    "vehicle-branding",
    "promotional-items",
    "it-support"
  ];

  const ui = {
    nav: document.getElementById("siteNav"),
    navToggle: document.getElementById("navToggle"),
    accordion: document.getElementById("productAccordion"),
    grid: document.getElementById("productGrid"),
    filters: document.getElementById("categoryFilters"),
    quoteSection: document.getElementById("quote"),
    quoteProduct: document.getElementById("quoteProduct"),
    quoteName: document.getElementById("quoteName"),
    quoteMessage: document.getElementById("quoteMessage")
  };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (m) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m]; });
  }

  function filteredItems() {
    if (state.activeFilter === "All") return allItems;
    return allItems.filter((item) => item.category === state.activeFilter);
  }

  function accordionItems() {
    const featured = featuredAccordionIds
      .map((id) => allItems.find((item) => item.id === id))
      .filter(Boolean);
    return featured.length ? featured : allItems.slice(0, 6);
  }

  function ensureActiveFromFilter() {
    const items = accordionItems();
    if (!items.length) {
      state.activeItemId = null;
      return;
    }
    const exists = items.some((item) => item.id === state.activeItemId);
    if (!exists) state.activeItemId = items[0].id;
  }

  function buildNav() {
    if (!ui.nav) return;
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    ui.nav.innerHTML = navItems.map(function (item) {
      const itemPage = item.href.split("#")[0] || "index.html";
      const currentHash = window.location.hash || "#home";
      const isSamePage = currentPage === itemPage || (currentPage === "" && itemPage === "index.html");
      const isActive = isSamePage && (!item.section || item.section === currentHash);
      return `<a href="${item.href}" class="${isActive ? "active" : ""}" data-nav-link>${item.label}</a>`;
    }).join("");
  }

  async function loadAuthState() {
    window.chavCurrentUser = null;
  }

  function closeNav() {
    if (!ui.nav || !ui.navToggle) return;
    ui.nav.classList.remove("is-open");
    ui.navToggle.setAttribute("aria-expanded", "false");
  }

  function setupMobileNav() {
    if (!ui.nav || !ui.navToggle) return;
    ui.navToggle.addEventListener("click", function () {
      const isOpen = ui.nav.classList.toggle("is-open");
      ui.navToggle.setAttribute("aria-expanded", String(isOpen));
    });
    ui.nav.addEventListener("click", function (event) {
      if (event.target.closest("a")) closeNav();
    });
    document.addEventListener("click", function (event) {
      if (!ui.nav.classList.contains("is-open")) return;
      if (event.target.closest("#siteNav") || event.target.closest("#navToggle")) return;
      closeNav();
    });
  }

  function setupSmoothScroll() {
    document.addEventListener("click", function (event) {
      const link = event.target.closest('a[href^="#"], button[data-fab-top], button[data-fab-quote]');
      if (!link) return;

      if (link.matches("[data-fab-top]")) {
        event.preventDefault();
        document.getElementById("home")?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      if (link.matches("[data-fab-quote]")) {
        event.preventDefault();
        ui.quoteSection?.scrollIntoView({ behavior: "smooth", block: "start" });
        return;
      }
      const target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeNav();
    });
  }

  function setupActiveNav() {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    if (currentPage !== "index.html" && currentPage !== "") return;
    const sections = navItems
      .map((x) => x.section ? document.querySelector(x.section) : null)
      .filter(Boolean);
    if (!sections.length) return;
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const id = `#${entry.target.id}`;
        document.querySelectorAll("[data-nav-link]").forEach(function (link) {
          link.classList.toggle("active", link.getAttribute("href").endsWith(id));
        });
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0.1 });
    sections.forEach((section) => observer.observe(section));
  }

  function renderFilters() {
    if (!ui.filters) return;
    ui.filters.innerHTML = categories.map((name) => `<button type="button" class="filter-btn ${name === state.activeFilter ? "active" : ""}" data-filter="${escapeHtml(name)}">${escapeHtml(name)}</button>`).join("");
  }

  function renderAccordion() {
    if (!ui.accordion) return;
    ensureActiveFromFilter();
    const items = accordionItems();
    ui.accordion.innerHTML = items.map(function (item, index) {
      const isActive = item.id === state.activeItemId;
      const serviceNumber = String(index + 1).padStart(2, "0");
      const featureChips = Array.isArray(item.features)
        ? item.features.slice(0, 3).map((feature) => `<span>${escapeHtml(feature)}</span>`).join("")
        : "";
      const actionMarkup = item.buttonText === "View Range"
        ? `<a class="panel-action" href="products.html#${escapeHtml(item.id)}">${escapeHtml(item.buttonText)}</a>`
        : `<button type="button" class="panel-action" data-quote-product="${escapeHtml(item.id)}">${escapeHtml(item.buttonText || "Get Quote")}</button>`;
      return `
        <article class="core-service-card ${isActive ? "active" : ""}" data-item-id="${escapeHtml(item.id)}" style="--panel-accent:${escapeHtml(item.accentColor)};">
          <div class="core-service-media">
            <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
            <span class="panel-number" aria-hidden="true">${serviceNumber}</span>
            <span class="core-service-compact-title">${escapeHtml(item.title)}</span>
          </div>
          <div class="core-service-content">
            <div class="core-service-topline">
              <span class="panel-category">${escapeHtml(item.category)}</span>
            </div>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.shortDescription)}</p>
            ${featureChips ? `<div class="panel-features">${featureChips}</div>` : ""}
            ${actionMarkup}
          </div>
        </article>`;
    }).join("");
    ui.accordion.scrollLeft = 0;
  }

  function setAccordionActive(itemId) {
    if (!ui.accordion) return;
    const panels = ui.accordion.querySelectorAll(".product-panel");
    let activePanel = null;
    panels.forEach(function (panel) {
      const isActive = panel.getAttribute("data-item-id") === itemId;
      panel.classList.toggle("active", isActive);
      if (isActive) activePanel = panel;
    });
    state.activeItemId = itemId;
    if (activePanel) {
      activePanel.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  function renderGrid() {
    if (!ui.grid) return;
    const items = filteredItems();
    ui.grid.innerHTML = items.map(function (item) {
      const featureChips = Array.isArray(item.features)
        ? item.features.slice(0, 2).map((feature) => `<span>${escapeHtml(feature)}</span>`).join("")
        : "";
      const actionMarkup = item.buttonText === "View Range"
        ? `<a class="range-link" href="products.html#${escapeHtml(item.id)}">${escapeHtml(item.buttonText)}</a>`
        : `<button type="button" class="range-link" data-quote-product="${escapeHtml(item.id)}">${escapeHtml(item.buttonText || "Get Quote")}</button>`;
      return `
        <article class="range-card" style="--card-accent:${escapeHtml(item.accentColor)};">
          <img class="range-image" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy">
          <div class="range-overlay"></div>
          <div class="range-content">
            <p class="range-category">${escapeHtml(item.category)}</p>
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.shortDescription)}</p>
            ${featureChips ? `<div class="range-features">${featureChips}</div>` : ""}
            ${actionMarkup}
          </div>
        </article>`;
    }).join("");
  }

  function updateViews() {
    renderFilters();
    renderAccordion();
    renderGrid();
  }

  function getItemById(id) {
    return allItems.find((item) => item.id === id) || null;
  }

  function prefillQuoteAndScroll(itemId) {
    const item = getItemById(itemId);
    if (!item) return;
    if (ui.quoteProduct) ui.quoteProduct.value = item.title;
    ui.quoteSection?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(function () {
      if (ui.quoteName && !ui.quoteName.value.trim()) {
        ui.quoteName.focus();
      } else {
        ui.quoteMessage?.focus();
      }
    }, 350);
  }

  function validateForm(form) {
    const name = form.querySelector('[name="name"]');
    const phone = form.querySelector('[name="phone"]');
    const email = form.querySelector('[name="email"]');
    const message = form.querySelector('[name="message"]');
    let valid = true;

    [name, phone, email, message].forEach(function (field) {
      if (!field) return;
      const value = field.value.trim();
      let fieldValid = value.length > 0;
      if (field.type === "email") fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      field.classList.toggle("invalid", !fieldValid);
      if (!fieldValid) valid = false;
    });

    return valid;
  }

  function fieldValue(form, name) {
    const field = form.querySelector(`[name="${name}"]`);
    return field ? field.value.trim() : "";
  }

  function buildEmailBody(form, formType) {
    const lines = [
      "Hello Chav Solutions,",
      "",
      formType === "quote" ? "I would like to request a quote." : "I would like to send a message.",
      "",
      `Name: ${fieldValue(form, "name")}`,
      `Phone: ${fieldValue(form, "phone")}`,
      `Email: ${fieldValue(form, "email")}`
    ];
    const product = fieldValue(form, "product");
    if (product) lines.push(`Service/Product: ${product}`);
    lines.push("", "Message:", fieldValue(form, "message"));

    const fileField = form.querySelector('[name="design_file"]');
    if (fileField && fileField.files && fileField.files.length) {
      lines.push("", `Design/reference file to attach: ${fileField.files[0].name}`);
    }

    return lines.join("\n");
  }

  function openEmailDraft(form, formType) {
    const product = fieldValue(form, "product");
    const subject = formType === "quote"
      ? `Quote Request${product ? `: ${product}` : ""}`
      : "Website Contact Message";
    const body = buildEmailBody(form, formType);
    window.location.href = `mailto:${siteEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function sendForm(form, formType, statusId) {
    const status = document.getElementById(statusId);
    const submit = form.querySelector('button[type="submit"]');
    if (!status || !submit) return;

    if (!validateForm(form)) {
      status.textContent = "Please complete required fields correctly.";
      status.style.color = "#b42f2f";
      return;
    }

    submit.disabled = true;
    status.textContent = "Opening your email app...";
    status.style.color = "#14407a";

    try {
      openEmailDraft(form, formType);
      status.textContent = "Your email app should open with the message ready. Attach any design files before sending.";
      status.style.color = "#1f8a4d";
    } catch (error) {
      status.textContent = "Could not open an email draft. Please email hello@chavsolutions.co.za directly.";
      status.style.color = "#b42f2f";
    } finally {
      submit.disabled = false;
    }
  }

  function setupForms() {
    const contactForm = document.getElementById("contactForm");
    const quoteForm = document.getElementById("quoteForm");
    if (contactForm) contactForm.addEventListener("submit", function (event) { event.preventDefault(); sendForm(contactForm, "contact", "contactStatus"); });
    if (quoteForm) quoteForm.addEventListener("submit", function (event) { event.preventDefault(); sendForm(quoteForm, "quote", "quoteStatus"); });
  }

  function scrollCoreServices(direction) {
    if (!ui.accordion) return;
    const cards = Array.from(ui.accordion.querySelectorAll(".core-service-card"));
    if (!cards.length) return;
    const activeIndex = Math.max(0, cards.findIndex((card) => card.classList.contains("active")));
    const nextIndex = Math.min(cards.length - 1, Math.max(0, activeIndex + direction));
    setCoreServiceActive(cards[nextIndex], true);
  }

  function setCoreServiceActive(card, shouldScroll) {
    if (!ui.accordion || !card) return;
    ui.accordion.querySelectorAll(".core-service-card").forEach(function (serviceCard) {
      serviceCard.classList.toggle("active", serviceCard === card);
    });
    state.activeItemId = card.getAttribute("data-item-id");
    if (shouldScroll) {
      card.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
  }

  function setupInteractions() {
    document.addEventListener("mouseover", function (event) {
      if (window.innerWidth < 992) return;
      const serviceCard = event.target.closest(".core-service-card");
      if (!serviceCard) return;
      setCoreServiceActive(serviceCard);
    });

    document.addEventListener("click", function (event) {
      const filterBtn = event.target.closest("[data-filter]");
      if (filterBtn) {
        state.activeFilter = filterBtn.getAttribute("data-filter");
        ensureActiveFromFilter();
        updateViews();
        return;
      }

      if (event.target.closest("[data-core-prev]")) {
        scrollCoreServices(-1);
        return;
      }

      if (event.target.closest("[data-core-next]")) {
        scrollCoreServices(1);
        return;
      }

      const serviceCard = event.target.closest(".core-service-card");
      if (serviceCard) {
        setCoreServiceActive(serviceCard, true);
      }

      const panel = event.target.closest(".product-panel");
      if (panel) {
        setAccordionActive(panel.getAttribute("data-item-id"));
      }

      const quoteBtn = event.target.closest("[data-quote-product]");
      if (quoteBtn) {
        prefillQuoteAndScroll(quoteBtn.getAttribute("data-quote-product"));
        return;
      }

      if (event.target.closest("[data-catalog-btn]")) {
        window.location.href = "products.html";
      }
    });
  }

  function setupYear() {
    const year = document.getElementById("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  buildNav();
  loadAuthState();
  setupMobileNav();
  setupSmoothScroll();
  setupActiveNav();
  setupInteractions();
  setupForms();
  setupYear();
  updateViews();
})();
