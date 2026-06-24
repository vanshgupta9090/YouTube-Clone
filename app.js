document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const sidebar = document.getElementById('sidebar');

    if (hamburger && sidebar) {
        hamburger.addEventListener('click', function () {
            sidebar.classList.toggle('collapsed');
        });
    }

    // Handle thumbnail hover -> iframe load (autoplay muted). Click pins the iframe.
    document.querySelectorAll('.video-thumb').forEach((thumb) => {
        let iframeEl = null;
        let pinned = false;
        const originalSrc = thumb.dataset.originalSrc;

        function createIframe(autoplayMuted) {
            const iframe = document.createElement('iframe');
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.frameBorder = '0';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
            iframe.allowFullscreen = true;
            const params = autoplayMuted ? 'autoplay=1&mute=1&controls=0' : 'autoplay=1&mute=0&controls=1';
            iframe.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + params;
            iframe.className = 'video-embed-active';
            return iframe;
        }

        function showIframe(autoplayMuted) {
            if (iframeEl) return; // already shown
            iframeEl = createIframe(autoplayMuted);
            thumb.innerHTML = '';
            thumb.appendChild(iframeEl);
        }

        function restoreThumb() {
            if (pinned) return;
            if (iframeEl) {
                iframeEl.remove();
                iframeEl = null;
            }
            // recreate img + play
            const img = document.createElement('img');
            img.src = `https://img.youtube.com/vi/${thumb.dataset.videoId}/hqdefault.jpg`;
            img.alt = 'thumb';
            const btn = document.createElement('button');
            btn.className = 'thumb-play';
            btn.setAttribute('aria-label', 'Play');
            thumb.innerHTML = '';
            thumb.appendChild(img);
            thumb.appendChild(btn);
            attachClick();
        }

        function attachClick() {
            const btn = thumb.querySelector('.thumb-play');
            if (!btn) return;
            btn.addEventListener('click', function (e) {
                pinned = true;
                showIframe(false);
            });
        }

        thumb.addEventListener('mouseenter', function () {
            if (!iframeEl) showIframe(true);
        });

        thumb.addEventListener('mouseleave', function () {
            // small timeout to avoid flicker if moving quickly
            setTimeout(() => {
                if (!pinned) restoreThumb();
            }, 150);
        });

        // Keyboard accessibility: Enter/Space to pin play, Escape to unpin
        thumb.addEventListener('keydown', function (e) {
            if (e.code === 'Enter' || e.code === 'Space') {
                e.preventDefault();
                pinned = true;
                showIframe(false);
            } else if (e.key === 'Escape' || e.code === 'Escape') {
                if (pinned) {
                    pinned = false;
                    restoreThumb();
                }
            }
        });

        // initial attach for the play button click
        attachClick();
    });
});
