document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const navLinks = mobileNav.querySelectorAll('a');
    const body = document.body;

    function openMenu() {
        mobileNav.classList.remove('hidden');
        mobileNav.classList.add('active');
        mobileNav.setAttribute('aria-hidden', 'false');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        body.style.overflow = 'hidden'; // Блокируем скролл основной страницы
    }

    function closeMenu() {
        mobileNav.classList.add('hidden');
        mobileNav.classList.remove('active');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        body.style.overflow = ''; // Восстанавливаем скролл
    }

    if (mobileMenuToggle && mobileNav) {
        mobileMenuToggle.addEventListener('click', () => {
            if (mobileNav.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', closeMenu);
    }

    // Закрытие меню при клике на ссылку (для SPA-подобной навигации на лендинге)
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Закрытие меню по клавише Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMenu();
        }
    });
}); 