document.addEventListener('DOMContentLoaded', () => {
    /* --- Мобильное меню --- */
    const burger = document.getElementById('burger');
    const nav = document.getElementById('nav');

    const toggleMenu = (open) => {
        nav.classList.toggle('is-open', open);
        burger.classList.toggle('is-open', open);
        burger.setAttribute('aria-expanded', String(open));
    };
    burger.addEventListener('click', () => toggleMenu(!nav.classList.contains('is-open')));
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => toggleMenu(false)));

    /* --- Шапка при прокрутке и кнопка «наверх» --- */
    const header = document.querySelector('.header');
    const toTop = document.getElementById('toTop');
    const onScroll = () => {
        header.classList.toggle('is-scrolled', window.scrollY > 40);
        toTop.classList.toggle('is-visible', window.scrollY > 600);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* --- Вкладки цен --- */
    const tabs = document.querySelectorAll('.tab');
    const panels = document.querySelectorAll('.price-panel');
    tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
            tabs.forEach((t) => {
                t.classList.toggle('is-active', t === tab);
                t.setAttribute('aria-selected', String(t === tab));
            });
            panels.forEach((p) => {
                const active = p.dataset.panel === tab.dataset.tab;
                p.classList.toggle('is-active', active);
                p.hidden = !active;
            });
        });
    });

    /* --- Слайдер отзывов --- */
    const slides = document.querySelectorAll('.review');
    const dotsBox = document.getElementById('sliderDots');
    let current = 0;
    let timer;

    const goTo = (i) => {
        current = (i + slides.length) % slides.length;
        slides.forEach((s, idx) => s.classList.toggle('is-active', idx === current));
        dotsBox.querySelectorAll('button').forEach((d, idx) => d.classList.toggle('is-active', idx === current));
    };
    const restart = () => {
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), 6000);
    };

    slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.setAttribute('aria-label', `Отзыв ${idx + 1}`);
        dot.addEventListener('click', () => { goTo(idx); restart(); });
        dotsBox.appendChild(dot);
    });
    document.querySelector('.slider__btn--prev').addEventListener('click', () => { goTo(current - 1); restart(); });
    document.querySelector('.slider__btn--next').addEventListener('click', () => { goTo(current + 1); restart(); });
    goTo(0);
    restart();

    /* --- Маска телефона --- */
    const phone = document.getElementById('phone');
    phone.addEventListener('input', () => {
        let digits = phone.value.replace(/\D/g, '');
        if (digits.startsWith('8')) digits = '7' + digits.slice(1);
        if (!digits.startsWith('7')) digits = '7' + digits;
        digits = digits.slice(0, 11);
        const p = digits.slice(1);
        let out = '+7';
        if (p.length) out += ' (' + p.slice(0, 3);
        if (p.length >= 3) out += ')';
        if (p.length > 3) out += ' ' + p.slice(3, 6);
        if (p.length > 6) out += '-' + p.slice(6, 8);
        if (p.length > 8) out += '-' + p.slice(8, 10);
        phone.value = out;
    });

    /* --- Минимальная дата записи — сегодня --- */
    const date = document.getElementById('date');
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    date.min = today.toISOString().slice(0, 10);

    /* --- Валидация формы --- */
    const form = document.getElementById('bookingForm');
    const success = document.getElementById('formSuccess');

    const setError = (input, msg) => {
        input.classList.toggle('is-invalid', Boolean(msg));
        const err = input.parentElement.querySelector('.form__error');
        if (err) err.textContent = msg || '';
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = form.elements.name;
        const agree = document.getElementById('agree');
        let ok = true;

        if (name.value.trim().length < 2) { setError(name, 'Введите имя'); ok = false; }
        else setError(name, '');

        if (phone.value.replace(/\D/g, '').length !== 11) { setError(phone, 'Введите номер полностью'); ok = false; }
        else setError(phone, '');

        agree.closest('.form__check').classList.toggle('is-invalid', !agree.checked);
        if (!agree.checked) ok = false;

        if (!ok) return;

        // Здесь можно отправить данные на сервер (fetch).
        success.hidden = false;
        form.reset();
        setTimeout(() => { success.hidden = true; }, 6000);
    });

    /* --- Появление блоков при прокрутке --- */
    const revealEls = document.querySelectorAll('.adv, .service, .doctor, .section__head, .price-list, .faq__item');
    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach((el) => { el.classList.add('reveal'); io.observe(el); });
    }

    document.getElementById('year').textContent = new Date().getFullYear();
});
