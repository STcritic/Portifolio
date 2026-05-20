const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');
const navLinks = document.querySelectorAll('.nav a');
const yearTarget = document.getElementById('year');
const revealItems = document.querySelectorAll('.reveal');
const heroPanel = document.querySelector('.portrait-panel');
const heroOrb = document.querySelector('.hero-orb');
const languageSwitchers = document.querySelectorAll('[data-language-switcher]');
let translationToastTimeout = null;
const isLocalTranslationBlocked = ['file:', 'http:', 'https:'].includes(window.location.protocol)
    && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const hasNativeEnglishHome = currentPage === 'index.html' || currentPage === 'index-en.html';

const showTranslationToast = (title, message) => {
    const existingToast = document.querySelector('.translation-toast');

    if (existingToast) {
        existingToast.remove();
    }

    if (translationToastTimeout) {
        window.clearTimeout(translationToastTimeout);
    }

    const toast = document.createElement('div');
    toast.className = 'translation-toast';
    toast.setAttribute('role', 'status');
    toast.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
    document.body.appendChild(toast);

    translationToastTimeout = window.setTimeout(() => {
        toast.remove();
    }, 5200);
};

if (yearTarget) {
    yearTarget.textContent = new Date().getFullYear();
}

if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            nav.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

languageSwitchers.forEach((switcher) => {
    const toggle = switcher.querySelector('.language-toggle');
    const englishLink = switcher.querySelector('[data-language="en"]');
    const portugueseLink = switcher.querySelector('[data-language="pt"]');

    if (!toggle || !englishLink || !portugueseLink) {
        return;
    }

    if (hasNativeEnglishHome) {
        portugueseLink.href = 'index.html';
        englishLink.href = 'index-en.html';
    } else {
        portugueseLink.href = currentPage;
    }

    if (!hasNativeEnglishHome && (window.location.protocol === 'file:' || isLocalTranslationBlocked)) {
        englishLink.href = '#';
        englishLink.addEventListener('click', (event) => {
            event.preventDefault();
            switcher.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            showTranslationToast(
                'A tradução não está disponível aqui',
                'Para traduzir esta página, abra o portfólio numa versão publicada na internet. Endereços locais como este não podem ser traduzidos dessa forma.'
            );
        });
    } else if (!hasNativeEnglishHome) {
        englishLink.href = `https://translate.google.com/translate?sl=pt&tl=en&u=${encodeURIComponent(window.location.href)}`;
    }

    toggle.addEventListener('click', () => {
        const isOpen = switcher.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });
});

document.addEventListener('click', (event) => {
    languageSwitchers.forEach((switcher) => {
        if (switcher.contains(event.target)) {
            return;
        }

        switcher.classList.remove('is-open');
        const toggle = switcher.querySelector('.language-toggle');

        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
        }
    });
});

if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.16
    });

    revealItems.forEach((item) => observer.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
}

if (heroPanel && heroOrb && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let animationFrame = null;
    let bounds = null;
    let previousX = null;
    let previousY = null;

    const refreshBounds = () => {
        const orbSize = heroOrb.offsetWidth;
        const panelWidth = heroPanel.clientWidth;
        const panelHeight = heroPanel.clientHeight;

        bounds = {
            centerX: panelWidth * 0.52,
            centerY: panelHeight * 0.48,
            radiusX: Math.max(42, (panelWidth - orbSize) * 0.34),
            radiusY: Math.max(52, (panelHeight - orbSize) * 0.3),
            orbSize
        };
    };

    const animateOrb = (time) => {
        if (!bounds) {
            refreshBounds();
        }

        const t = time * 0.000245;
        const driftX = Math.sin(t * 1.7) * 12;
        const driftY = Math.cos(t * 1.3) * 8;
        const x = bounds.centerX + Math.cos(t) * bounds.radiusX + driftX - bounds.orbSize / 2;
        const y = bounds.centerY + Math.sin(t * 1.18) * bounds.radiusY + driftY - bounds.orbSize / 2;
        const scale = 0.94 + ((Math.sin(t * 2.1) + 1) * 0.05);

        if (previousX !== null && previousY !== null) {
            const deltaX = x - previousX;
            const deltaY = y - previousY;
            const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;
            const velocity = Math.hypot(deltaX, deltaY);
            const stretch = Math.min(1.18, 1 + velocity * 0.1);

            heroOrb.style.setProperty('--trail-angle', `${angle}deg`);
            heroOrb.style.setProperty('--trail-stretch', stretch.toFixed(3));
        }

        heroOrb.style.transform = `translate(${x}px, ${y}px) scale(${scale.toFixed(3)})`;
        previousX = x;
        previousY = y;
        animationFrame = window.requestAnimationFrame(animateOrb);
    };

    refreshBounds();
    animationFrame = window.requestAnimationFrame(animateOrb);
    window.addEventListener('resize', refreshBounds);
    window.addEventListener('beforeunload', () => {
        if (animationFrame) {
            window.cancelAnimationFrame(animationFrame);
        }
    });
}
