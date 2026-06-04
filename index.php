<?php
  $pageTitle = 'Chav Solutions | Branding, Design & Print';
?>
<!doctype html>
<html lang="en">
<head>
  <?php include __DIR__ . '/includes/header.php'; ?>
</head>
<body>
  <header class="site-header" id="top">
    <div class="container nav-wrap">
      <a href="#top" class="brand" aria-label="Chav Solutions Home">
        <img src="assets/logo/chav_solution_logo-removebg-preview.png" alt="Chav Solutions logo" class="brand-logo">
        <span class="brand-text">Chav Solutions</span>
      </a>
      <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">Menu</button>
      <nav id="site-nav" class="site-nav">
        <a href="#about">About</a>
        <a href="#products">Products</a>
        <a href="#why-us">Why Us</a>
        <a href="#contact">Contact</a>
      </nav>
    </div>
  </header>

  <main>
    <section class="hero section">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">Branding, Design & Print Solutions</p>
          <h1>Professional Print & Branding That Makes Your Business Stand Out</h1>
          <p class="lead">From event displays to corporate branding assets, we deliver high-impact visual solutions tailored to your brand goals.</p>
          <a class="btn btn-primary" href="#products">Explore Products</a>
        </div>
        <div class="hero-card">
          <h2>Fast Turnaround</h2>
          <p>Reliable delivery, premium finishes, and consistent brand quality across every print run.</p>
        </div>
      </div>
    </section>

    <section class="about section" id="about">
      <div class="container about-grid">
        <div>
          <h2>Built for Visibility, Designed for Impact</h2>
          <p>We help businesses communicate clearly through strategic design and high-quality print production. Whether you need indoor displays or outdoor branding, our team provides practical guidance and production expertise from concept to final install.</p>
        </div>
        <ul class="about-points">
          <li>Custom branding consultation</li>
          <li>Design-to-print workflow</li>
          <li>Durable materials for indoor/outdoor use</li>
          <li>Consistent quality control</li>
        </ul>
      </div>
    </section>

    <?php include __DIR__ . '/includes/products.php'; ?>

    <section class="why-us section" id="why-us">
      <div class="container">
        <h2>Why Choose Chav Solutions</h2>
        <div class="why-grid">
          <article class="why-card">
            <h3>Brand-First Approach</h3>
            <p>Every output is aligned with your visual identity and business goals.</p>
          </article>
          <article class="why-card">
            <h3>Practical Expertise</h3>
            <p>We recommend materials and formats that work in real environments.</p>
          </article>
          <article class="why-card">
            <h3>End-to-End Service</h3>
            <p>From design and revisions to print and deployment support.</p>
          </article>
        </div>
      </div>
    </section>

    <section class="cta section" id="contact">
      <div class="container cta-box">
        <h2>Ready to Elevate Your Brand Presence?</h2>
        <p>Tell us what you need and we will prepare a tailored quotation.</p>
        <a class="btn btn-accent" href="mailto:info@chavsolutions.co.za">Get a Quote</a>
      </div>
    </section>
  </main>

  <?php include __DIR__ . '/includes/footer.php'; ?>
</body>
</html>
