const yearNode = document.getElementById('year');
const languageSwitchers = document.querySelectorAll('[data-language-switcher]');
let translationToastTimeout = null;
const isLocalTranslationBlocked = ['file:', 'http:', 'https:'].includes(window.location.protocol)
    && ['localhost', '127.0.0.1'].includes(window.location.hostname);

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

if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

languageSwitchers.forEach((switcher) => {
    const toggle = switcher.querySelector('.language-toggle');
    const englishLink = switcher.querySelector('[data-language="en"]');
    const portugueseLink = switcher.querySelector('[data-language="pt"]');

    if (!toggle || !englishLink || !portugueseLink) {
        return;
    }

    portugueseLink.href = window.location.pathname.split('/').pop() || 'index.html';

    if (window.location.protocol === 'file:' || isLocalTranslationBlocked) {
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
    } else {
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

document.querySelectorAll('[data-toggle-article]').forEach((button) => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-toggle-article');
        const target = document.getElementById(targetId);

        if (!target) {
            return;
        }

        const isOpen = target.classList.toggle('is-open');
        button.textContent = isOpen ? 'Ler menos' : 'Continuar leitura';
        button.setAttribute('aria-expanded', String(isOpen));
    });
});
