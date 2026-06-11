<?php
$products = [
  [
    'title' => 'Banners',
    'description' => 'High-impact indoor and outdoor banners for promotions, events, and storefront visibility.',
    'image' => 'assets/images/products/banners.jpg'
  ],
  [
    'title' => 'Branded Flags',
    'description' => 'Feather and teardrop flags designed to increase walk-by attention at activations and exhibitions.',
    'image' => 'assets/images/products/branded-flags.jpg'
  ],
  [
    'title' => 'Gazebos and Shades',
    'description' => 'Custom printed gazebos and shade structures for outdoor campaigns, markets, and corporate days.',
    'image' => 'assets/images/products/gazebos-shades.jpg'
  ],
  [
    'title' => 'Pop-up Banners',
    'description' => 'Portable pull-up and pop-up banners for conferences, retail spaces, and quick setup displays.',
    'image' => 'assets/images/products/popup-banners.jpg'
  ],
  [
    'title' => 'Banner Walls',
    'description' => 'Professional backdrop banner walls for media events, stage setups, and branded photography points.',
    'image' => 'assets/images/products/banner-walls.jpg'
  ],
  [
    'title' => 'Wall Banners',
    'description' => 'Large-format wall graphics and banners that transform interior and exterior brand environments.',
    'image' => 'assets/images/products/wall-banners.jpg'
  ],
  [
    'title' => 'Promotional Displays',
    'description' => 'Retail and event display units engineered for engagement, sampling stations, and product launches.',
    'image' => 'assets/images/products/promotional-displays.jpg'
  ],
  [
    'title' => 'General Branding and Printing',
    'description' => 'Full-service design and print support for brochures, signage, branded apparel, and marketing collateral.',
    'image' => 'assets/images/products/general-branding-printing.jpg'
  ]
];
?>
<section class="products section" id="products">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow">Our Range of Products</p>
      <h2>Branding, Design & Print Solutions</h2>
    </div>

    <div class="products-carousel" data-carousel>
      <button class="carousel-btn prev" type="button" aria-label="Previous products" data-carousel-prev>&#10094;</button>

      <div class="carousel-viewport" data-carousel-viewport>
        <div class="carousel-track" data-carousel-track>
          <?php foreach ($products as $product): ?>
            <article class="product-card">
              <div class="product-image-wrap">
                <img
                  src="<?php echo htmlspecialchars($product['image'], ENT_QUOTES, 'UTF-8'); ?>"
                  alt="<?php echo htmlspecialchars($product['title'], ENT_QUOTES, 'UTF-8'); ?>"
                  loading="lazy"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';"
                >
                <div class="product-placeholder" style="display:none;">
                  <span><?php echo htmlspecialchars($product['title'], ENT_QUOTES, 'UTF-8'); ?></span>
                </div>
              </div>
              <div class="product-content">
                <h3><?php echo htmlspecialchars($product['title'], ENT_QUOTES, 'UTF-8'); ?></h3>
                <p><?php echo htmlspecialchars($product['description'], ENT_QUOTES, 'UTF-8'); ?></p>
                <a class="btn btn-outline" href="mailto:info@chavsolutions.co.za?subject=<?php echo rawurlencode('Quote Request: ' . $product['title']); ?>">Get Quote</a>
              </div>
            </article>
          <?php endforeach; ?>
        </div>
      </div>

      <button class="carousel-btn next" type="button" aria-label="Next products" data-carousel-next>&#10095;</button>
    </div>
    <p class="replace-note">Replace placeholder images by adding files into <code>assets/images/products/</code> using the same filenames listed in <code>includes/products.php</code>.</p>
  </div>
</section>
