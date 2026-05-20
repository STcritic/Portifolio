const yearNode = document.getElementById('year');
const languageSwitchers = document.querySelectorAll('[data-language-switcher]');
let translationToastTimeout = null;
const isLocalTranslationBlocked = ['file:', 'http:', 'https:'].includes(window.location.protocol)
    && ['localhost', '127.0.0.1'].includes(window.location.hostname);
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
const articleLanguageMap = {
    'rh-digital.html': { pt: 'rh-digital.html', en: 'rh-digital-en.html' },
    'rh-digital-en.html': { pt: 'rh-digital.html', en: 'rh-digital-en.html' },
    'decidi-estudar-direito.html': { pt: 'decidi-estudar-direito.html', en: 'decidi-estudar-direito-en.html' },
    'decidi-estudar-direito-en.html': { pt: 'decidi-estudar-direito.html', en: 'decidi-estudar-direito-en.html' },
    'covid-19.html': { pt: 'covid-19.html', en: 'covid-19-en.html' },
    'covid-19-en.html': { pt: 'covid-19.html', en: 'covid-19-en.html' },
    'rh-inteligencia-artificial.html': { pt: 'rh-inteligencia-artificial.html', en: 'rh-inteligencia-artificial-en.html' },
    'rh-inteligencia-artificial-en.html': { pt: 'rh-inteligencia-artificial.html', en: 'rh-inteligencia-artificial-en.html' }
};
const hasNativeEnglishArticle = Boolean(articleLanguageMap[currentPage]);
const htmlLang = document.documentElement.lang || 'pt';

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

    if (hasNativeEnglishArticle) {
        portugueseLink.href = articleLanguageMap[currentPage].pt;
        englishLink.href = articleLanguageMap[currentPage].en;
    } else {
        portugueseLink.href = currentPage;
    }

    if (!hasNativeEnglishArticle && (window.location.protocol === 'file:' || isLocalTranslationBlocked)) {
        englishLink.href = '#';
        englishLink.addEventListener('click', (event) => {
            event.preventDefault();
            switcher.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            showTranslationToast(
                htmlLang === 'en' ? 'Translation is not available here' : 'A tradução não está disponível aqui',
                htmlLang === 'en'
                    ? 'To translate this page, open the portfolio in a published online version. Local addresses like this cannot be translated in that way.'
                    : 'Para traduzir esta página, abra o portfólio numa versão publicada na internet. Endereços locais como este não podem ser traduzidos dessa forma.'
            );
        });
    } else if (!hasNativeEnglishArticle) {
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
        button.textContent = isOpen
            ? (htmlLang === 'en' ? 'Read less' : 'Ler menos')
            : (htmlLang === 'en' ? 'Read more' : 'Continuar leitura');
        button.setAttribute('aria-expanded', String(isOpen));
    });
});
