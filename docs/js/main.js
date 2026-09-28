/**
 * ==========================================================================
 * WAALL - Main Script (Buildless Vanilla JavaScript)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    initSmoothScroll();
});

/**
 * 高速・快適なスムーズスクロール（所要時間: 約260ms / easeOutCubic）
 * 忙しいビジネスパーソンでもストレスを感じないキビキビとした減速移動を提供
 */
function initSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // ロゴクリックまたはトップリンク
            if (targetId === '#' || targetId === '') {
                e.preventDefault();
                quickScrollTo(0);
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;

            e.preventDefault();
            // 固定ヘッダー（約64px）+ 呼吸空間（約16px）= 80px (5rem)
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            quickScrollTo(offsetPosition);
            history.pushState(null, null, targetId);
        });
    });
}

/**
 * 高速イージングスクロール関数
 * @param {number} targetPosition スクロール先のY座標
 */
function quickScrollTo(targetPosition) {
    // 視覚効果を減らす設定（a11y）が有効な場合は即時ジャンプ
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        window.scrollTo(0, targetPosition);
        return;
    }

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    if (Math.abs(distance) < 2) return;

    // 待ち時間を感じさせない高速移動（260ms）
    const duration = 260;
    let startTime = null;

    function step(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // easeOutCubic: 初速が高く、目的地手前でスッと減速して吸い付く
        const ease = 1 - Math.pow(1 - progress, 3);
        window.scrollTo(0, startPosition + distance * ease);

        if (elapsed < duration) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}
