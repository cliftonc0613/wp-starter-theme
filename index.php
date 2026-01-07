<?php
/**
 * Main template file
 *
 * This is a headless WordPress theme. The frontend is rendered by Next.js.
 * This file exists only to satisfy WordPress theme requirements.
 *
 * @package Starter_WP_Theme
 * @version 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

get_header();
?>

<main id="primary" class="site-main">
    <div class="headless-notice">
        <h1><?php esc_html_e('Headless WordPress Theme', 'starter-wp-theme'); ?></h1>
        <p><?php esc_html_e('This is a headless WordPress installation. The frontend is powered by Next.js.', 'starter-wp-theme'); ?></p>

        <?php if (defined('STARTER_FRONTEND_URL') || get_option('starter_frontend_url')): ?>
            <?php
            $frontend_url = defined('STARTER_FRONTEND_URL')
                ? STARTER_FRONTEND_URL
                : get_option('starter_frontend_url', '#');
            ?>
            <p>
                <a href="<?php echo esc_url($frontend_url); ?>" class="frontend-link">
                    <?php esc_html_e('Visit Frontend →', 'starter-wp-theme'); ?>
                </a>
            </p>
        <?php endif; ?>

        <hr>

        <h2><?php esc_html_e('Available REST API Endpoints', 'starter-wp-theme'); ?></h2>
        <ul class="api-endpoints">
            <li><code>/wp-json/wp/v2/posts</code> - <?php esc_html_e('Blog Posts', 'starter-wp-theme'); ?></li>
            <li><code>/wp-json/wp/v2/pages</code> - <?php esc_html_e('Pages', 'starter-wp-theme'); ?></li>
            <li><code>/wp-json/wp/v2/services</code> - <?php esc_html_e('Services', 'starter-wp-theme'); ?></li>
            <li><code>/wp-json/wp/v2/testimonials</code> - <?php esc_html_e('Testimonials', 'starter-wp-theme'); ?></li>
            <li><code>/wp-json/wp/v2/media</code> - <?php esc_html_e('Media', 'starter-wp-theme'); ?></li>
        </ul>

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
    .headless-notice h1 {
        font-family: var(--font-heading, Georgia, serif);
        margin-bottom: 1rem;
    }
    .headless-notice h2 {
        font-size: 1.25rem;
        margin: 1.5rem 0 1rem;
    }
    .headless-notice p {
        color: var(--color-text-muted, #8d99ae);
        line-height: 1.6;
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
