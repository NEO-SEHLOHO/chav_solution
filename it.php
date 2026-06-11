<?php
declare(strict_types=1);

require __DIR__ . '/includes/site-layout.php';

chav_render_page([
    'title' => 'Chav Solutions IT | Support, Networks & Website Services',
    'description' => 'Chav Solutions IT services including support, networking, website services, maintenance plans, and business technology support.',
    'body_class' => 'it-site',
    'source' => __DIR__ . '/it.html',
    'strip_text' => 'Business IT, Networks & Website Support',
    'strip_link' => 'index.php#quote',
    'strip_link_text' => 'Book IT Support',
    'scripts' => ['assets/js/products.js', 'assets/js/main.js'],
]);
