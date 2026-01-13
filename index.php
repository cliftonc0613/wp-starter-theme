<?php
/**
 * Main template file
 *
 * This is a headless WordPress theme. The frontend is rendered by Next.js.
 * This file displays a customizable landing page with project info and API docs.
 * Settings are managed via Settings → Homepage in the admin.
 *
 * @package Starter_WP_Theme
 * @version 1.1.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Get ACF fields with fallbacks
$logo = function_exists('get_field') ? get_field('homepage_logo', 'option') : '';
$title = function_exists('get_field') ? get_field('homepage_title', 'option') : '';
$intro = function_exists('get_field') ? get_field('homepage_intro', 'option') : '';
$frontend_url = function_exists('get_field') ? get_field('homepage_frontend_url', 'option') : '';
$frontend_label = function_exists('get_field') ? get_field('homepage_frontend_label', 'option') : '';
$show_endpoints = function_exists('get_field') ? get_field('homepage_show_endpoints', 'option') : true;
$endpoints = function_exists('get_field') ? get_field('homepage_endpoints', 'option') : array();

// Fallback values
if (empty($title)) {
    $title = __('Headless WordPress Theme', 'starter-wp-theme');
}
if (empty($intro)) {
    $intro = '<p>' . __('This is a headless WordPress installation. The frontend is powered by Next.js.', 'starter-wp-theme') . '</p>';
}
if (empty($frontend_url)) {
    $frontend_url = defined('STARTER_FRONTEND_URL')
        ? STARTER_FRONTEND_URL
        : get_option('starter_frontend_url', '');
}
if (empty($frontend_label)) {
    $frontend_label = __('View Frontend →', 'starter-wp-theme');
}

// Default endpoints if none configured
if (empty($endpoints) && $show_endpoints) {
    $endpoints = array(
        array('name' => 'Posts', 'path' => '/wp-json/wp/v2/posts', 'description' => __('Blog Posts', 'starter-wp-theme')),
        array('name' => 'Pages', 'path' => '/wp-json/wp/v2/pages', 'description' => __('Pages', 'starter-wp-theme')),
        array('name' => 'Services', 'path' => '/wp-json/wp/v2/services', 'description' => __('Services', 'starter-wp-theme')),
        array('name' => 'Testimonials', 'path' => '/wp-json/wp/v2/testimonials', 'description' => __('Testimonials', 'starter-wp-theme')),
        array('name' => 'Media', 'path' => '/wp-json/wp/v2/media', 'description' => __('Media', 'starter-wp-theme')),
    );
}

get_header();
?>

<main id="primary" class="site-main">
    <div class="headless-notice">
        <?php if ($logo): ?>
            <div class="site-logo">
                <img src="<?php echo esc_url($logo); ?>" alt="<?php echo esc_attr($title); ?>" class="logo-image">
            </div>
        <?php endif; ?>

        <h1><?php echo esc_html($title); ?></h1>

        <div class="intro-content">
            <?php echo wp_kses_post($intro); ?>
        </div>

        <?php if ($frontend_url): ?>
            <p>
                <a href="<?php echo esc_url($frontend_url); ?>" class="frontend-link">
                    <?php echo esc_html($frontend_label); ?>
                </a>
            </p>
        <?php endif; ?>

        <?php if ($show_endpoints && !empty($endpoints)): ?>
            <hr>

            <h2><?php esc_html_e('Available REST API Endpoints', 'starter-wp-theme'); ?></h2>
            <ul class="api-endpoints">
                <?php foreach ($endpoints as $endpoint): ?>
                    <li>
                        <code><?php echo esc_html($endpoint['path']); ?></code>
                        <?php if (!empty($endpoint['description'])): ?>
                            - <?php echo esc_html($endpoint['description']); ?>
                        <?php elseif (!empty($endpoint['name'])): ?>
                            - <?php echo esc_html($endpoint['name']); ?>
                        <?php endif; ?>
                    </li>
                <?php endforeach; ?>
            </ul>
        <?php endif; ?>

        <p class="admin-link">
            <a href="<?php echo esc_url(admin_url()); ?>">
                <?php esc_html_e('← Go to WordPress Admin', 'starter-wp-theme'); ?>
            </a>
        </p>
    </div>
</main>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">

<style>
    :root {
        /* Dark mode colors matching Next.js frontend */
        --background: oklch(0.145 0 0);
        --foreground: oklch(0.985 0 0);
        --card: oklch(0.205 0 0);
        --card-foreground: oklch(0.985 0 0);
        --muted: oklch(0.269 0 0);
        --muted-foreground: oklch(0.708 0 0);
        --border: oklch(1 0 0 / 10%);
        --primary: oklch(0.922 0 0);
        --primary-foreground: oklch(0.205 0 0);
        --radius: 0.625rem;

        /* Typography */
        --font-sans: 'DM Sans', system-ui, sans-serif;
        --font-heading: 'Playfair Display', Georgia, serif;
        --font-mono: 'JetBrains Mono', monospace;
    }

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        padding: 0;
        background: var(--background);
        color: var(--foreground);
        font-family: var(--font-sans);
        line-height: 1.6;
        min-height: 100vh;
    }

    .site-main {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        padding: 2rem;
    }

    .headless-notice {
        max-width: 720px;
        width: 100%;
        padding: 3rem;
        background: var(--card);
        color: var(--card-foreground);
        border-radius: calc(var(--radius) + 8px);
        border: 1px solid var(--border);
    }

    .site-logo {
        margin-bottom: 2rem;
    }

    .logo-image {
        max-width: 180px;
        max-height: 60px;
        width: auto;
        height: auto;
        filter: brightness(0) invert(1);
    }

    .headless-notice h1 {
        font-family: var(--font-heading);
        font-size: 2.5rem;
        font-weight: 700;
        margin: 0 0 1.5rem 0;
        letter-spacing: -0.02em;
        line-height: 1.2;
    }

    .headless-notice h2 {
        font-family: var(--font-heading);
        font-size: 1.25rem;
        font-weight: 600;
        margin: 2rem 0 1rem;
        letter-spacing: -0.01em;
    }

    .intro-content,
    .intro-content p {
        color: var(--muted-foreground);
        font-size: 1.0625rem;
        line-height: 1.7;
        margin-bottom: 1.5rem;
    }

    .headless-notice hr {
        border: none;
        border-top: 1px solid var(--border);
        margin: 2.5rem 0;
    }

    .headless-notice code {
        background: var(--muted);
        color: var(--foreground);
        padding: 0.25rem 0.5rem;
        border-radius: calc(var(--radius) - 4px);
        font-family: var(--font-mono);
        font-size: 0.8125rem;
        font-weight: 500;
    }

    .api-endpoints {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .api-endpoints li {
        padding: 0.875rem 0;
        border-bottom: 1px solid var(--border);
        color: var(--muted-foreground);
        font-size: 0.9375rem;
    }

    .api-endpoints li:last-child {
        border-bottom: none;
    }

    .frontend-link {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: var(--primary);
        color: var(--primary-foreground) !important;
        padding: 0.875rem 1.75rem;
        border-radius: var(--radius);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9375rem;
        transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .frontend-link:hover {
        opacity: 0.9;
        transform: translateY(-1px);
    }

    .admin-link {
        margin-top: 2rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);
    }

    .admin-link a {
        color: var(--muted-foreground);
        text-decoration: none;
        font-size: 0.875rem;
        transition: color 0.2s ease;
    }

    .admin-link a:hover {
        color: var(--foreground);
    }

    /* Responsive adjustments */
    @media (max-width: 640px) {
        .headless-notice {
            padding: 2rem;
        }
        .headless-notice h1 {
            font-size: 1.875rem;
        }
    }
</style>

<?php
get_footer();
