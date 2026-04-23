<?php
// ── THEME SETUP ──────────────────────────────────────
function tides_setup() {
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', ['search-form','comment-form','comment-list','gallery','caption']);
    add_theme_support('automatic-feed-links');
    register_nav_menus(['primary' => 'Primary Navigation']);
}
add_action('after_setup_theme', 'tides_setup');

// ── ENQUEUE STYLES & SCRIPTS ─────────────────────────
function tides_scripts() {
    wp_enqueue_style(
        'google-fonts',
        'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap',
        [], null
    );
    wp_enqueue_style('tides-style', get_stylesheet_uri(), ['google-fonts'], '1.0.0');
    wp_enqueue_script('tides-nav', get_template_directory_uri() . '/js/nav.js', [], '1.0.0', true);
}
add_action('wp_enqueue_scripts', 'tides_scripts');

// ── EXCERPT LENGTH & READ MORE ────────────────────────
function tides_excerpt_length($length) { return 28; }
add_filter('excerpt_length', 'tides_excerpt_length');

function tides_excerpt_more($more) { return '…'; }
add_filter('excerpt_more', 'tides_excerpt_more');

// ── READING TIME HELPER ───────────────────────────────
function tides_reading_time() {
    $content   = get_post_field('post_content', get_the_ID());
    $word_count = str_word_count(strip_tags($content));
    $minutes   = max(1, round($word_count / 200));
    return $minutes . ' min read';
}
