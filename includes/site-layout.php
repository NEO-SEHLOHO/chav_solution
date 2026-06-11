<?php
declare(strict_types=1);

function chav_extract_main(string $sourceFile): string
{
    $html = file_get_contents($sourceFile);
    if ($html === false) {
        return '<main><section class="section"><div class="container"><h1>Page content unavailable.</h1></div></section></main>';
    }

    if (!preg_match('/<main\b[^>]*>.*?<\/main>/is', $html, $matches)) {
        return '<main><section class="section"><div class="container"><h1>Page content unavailable.</h1></div></section></main>';
    }

    return chav_rewrite_internal_links($matches[0]);
}

function chav_rewrite_internal_links(string $html): string
{
    $replacements = [
        'index.html' => 'index.php',
        'branding.html' => 'branding.php',
        'it.html' => 'it.php',
        'surveillance.html' => 'surveillance.php',
        'products.html' => 'products.php',
    ];

    return str_replace(array_keys($replacements), array_values($replacements), $html);
}

function chav_render_page(array $config): void
{
    $title = htmlspecialchars((string)($config['title'] ?? 'Chav Solutions'), ENT_QUOTES, 'UTF-8');
    $description = htmlspecialchars((string)($config['description'] ?? 'Chav Solutions services and products.'), ENT_QUOTES, 'UTF-8');
    $bodyClass = trim((string)($config['body_class'] ?? ''));
    $source = (string)($config['source'] ?? '');
    $stripText = htmlspecialchars((string)($config['strip_text'] ?? 'Branding, Printing, IT & Security Solutions'), ENT_QUOTES, 'UTF-8');
    $stripLink = htmlspecialchars((string)($config['strip_link'] ?? 'index.php#quote'), ENT_QUOTES, 'UTF-8');
    $stripLinkText = htmlspecialchars((string)($config['strip_link_text'] ?? 'Get Quote'), ENT_QUOTES, 'UTF-8');
    $scripts = $config['scripts'] ?? ['assets/js/products.js', 'assets/js/main.js'];
    $mainContent = $source !== '' ? chav_extract_main($source) : '<main></main>';
    $bodyClassAttribute = $bodyClass !== '' ? ' class="' . htmlspecialchars($bodyClass, ENT_QUOTES, 'UTF-8') . '"' : '';
    ?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="<?php echo $description; ?>" />
  <title><?php echo $title; ?></title>
  <link rel="stylesheet" href="assets/css/style.css" />
</head>
<body<?php echo $bodyClassAttribute; ?>>
  <div class="top-strip">
    <div class="container top-strip-wrap">
      <div class="top-strip-left">
        <span>Email: hello@chavsolutions.co.za</span>
        <span>Phone: +27 11 555 0123</span>
        <span><?php echo $stripText; ?></span>
      </div>
      <a href="<?php echo $stripLink; ?>" class="top-visit"><?php echo $stripLinkText; ?></a>
    </div>
  </div>

  <header class="site-header" id="home">
    <div class="container nav-wrap">
      <a href="index.php#home" class="brand" aria-label="Chav Solutions home">
        <img src="assets/logo/chav_solution_logo-removebg-preview.png" alt="Chav Solutions logo" class="brand-logo" />
      </a>
      <button id="navToggle" class="nav-toggle" aria-expanded="false" aria-controls="siteNav">Menu</button>
      <nav id="siteNav" class="site-nav" aria-label="Primary navigation"></nav>
    </div>
  </header>

  <?php echo $mainContent; ?>

  <footer class="site-footer">
    <div class="container footer-wrap">
      <p>&copy; <span id="year"></span> Chav Solutions. All rights reserved.</p>
      <a href="index.php#home">Back to home</a>
    </div>
  </footer>

  <?php foreach ($scripts as $script): ?>
    <script src="<?php echo htmlspecialchars((string)$script, ENT_QUOTES, 'UTF-8'); ?>"></script>
  <?php endforeach; ?>
</body>
</html>
    <?php
}
