const yearNode = document.getElementById('year');

if (yearNode) {
    yearNode.textContent = new Date().getFullYear();
}

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
