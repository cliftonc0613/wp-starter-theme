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

<style>
    .headless-notice {
        max-width: 800px;
        margin: 4rem auto;
        padding: 2rem;
        font-family: var(--font-primary, -apple-system, BlinkMacSystemFont, sans-serif);
        background: var(--color-surface, #1a1a2e);
        color: var(--color-text, #edf2f4);
        border-radius: 1rem;
    }
    .site-logo {
        margin-bottom: 1.5rem;
    }
    .logo-image {
        max-width: 200px;
        max-height: 80px;
        width: auto;
        height: auto;
    }
    .headless-notice h1 {
        font-family: var(--font-heading, Georgia, serif);
        margin-bottom: 1rem;
    }
    .headless-notice h2 {
        font-size: 1.25rem;
        margin: 1.5rem 0 1rem;
    }
    .headless-notice p,
    .intro-content {
        color: var(--color-text-muted, #8d99ae);
        line-height: 1.6;
    }
    .intro-content p {
        margin-bottom: 1rem;
    }
    .headless-notice hr {
        border: none;
        border-top: 1px solid var(--color-border, #2b2d42);
        margin: 2rem 0;
    }
    .headless-notice code {
        background: var(--color-background, #0f0f1a);
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-family: var(--font-mono, monospace);
        font-size: 0.875rem;
    }
    .api-endpoints {
        list-style: none;
        padding: 0;
    }
    .api-endpoints li {
        padding: 0.5rem 0;
        border-bottom: 1px solid var(--color-border, #2b2d42);
    }
    .frontend-link {
        display: inline-block;
        background: var(--color-accent, #e94560);
        color: white !important;
        padding: 0.75rem 1.5rem;
        border-radius: 0.5rem;
        text-decoration: none;
        font-weight: 600;
        transition: background 0.2s ease;
    }
    .frontend-link:hover {
        background: var(--color-accent-hover, #ff6b6b);
    }
    .admin-link a {
        color: var(--color-accent, #e94560);
    }
</style>

<?php
get_footer();
