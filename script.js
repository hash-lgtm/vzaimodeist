// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('feedbackForm');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const toast = document.getElementById('toast-notification');

    // Проверяем, существует ли элемент с уведомлением (если нет — создаём)
    if (!toast) {
        const newToast = document.createElement('div');
        newToast.id = 'toast-notification';
        newToast.className = 'toast';
        newToast.textContent = 'Спасибо, ваше обращение принято';
        document.body.appendChild(newToast);
        toast = newToast;
    }

    // Функция для показа всплывающего уведомления
    function showToast() {
        if (!toast) return;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }

    // Валидация email (более строгая, но без излишеств)
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Функция показа ошибки под полем ввода
    function showError(input, message) {
        // Находим родительский элемент (label + input находятся в одном div или form-group)
        let formGroup = input.closest('.form-group');
        if (!formGroup) {
            // Если обёртки нет, используем parentElement
            formGroup = input.parentElement;
        }
        
        // Проверяем, нет ли уже ошибки для этого поля
        const existingError = formGroup.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Создаём элемент с ошибкой
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.color = '#dc3545';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.textContent = message;
        
        formGroup.appendChild(errorDiv);
        
        // Подсвечиваем поле красной рамкой
        input.style.borderColor = '#dc3545';
        input.classList.add('error');
        
        // Убираем подсветку и ошибку при вводе (однократно)
        const removeError = function() {
            input.style.borderColor = '';
            input.classList.remove('error');
            const err = formGroup.querySelector('.error-message');
            if (err) err.remove();
            input.removeEventListener('input', removeError);
            input.removeEventListener('change', removeError);
        };
        
        input.addEventListener('input', removeError, { once: true });
        input.addEventListener('change', removeError, { once: true });
    }

    // Очистка всех ошибок
    function clearErrors() {
        const errorMessages = document.querySelectorAll('.error-message');
        errorMessages.forEach(err => err.remove());
        
        const inputs = [nameInput, emailInput, messageInput];
        inputs.forEach(input => {
            if (input) {
                input.style.borderColor = '';
                input.classList.remove('error');
            }
        });
    }

    // Проверка поля на пустоту с кастомным сообщением
    function isNotEmpty(value, fieldName) {
        return value !== '' && value !== null && value.trim() !== '';
    }

    // Обработка отправки формы
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Предотвращаем перезагрузку страницы

            // Получаем значения полей и убираем лишние пробелы
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            // Очищаем предыдущие сообщения об ошибках
            clearErrors();

            let hasError = false;

            // Проверка имени
            if (!isNotEmpty(name, 'Имя')) {
                showError(nameInput, 'Поле "Имя" обязательно для заполнения');
                hasError = true;
            }

            // Проверка email
            if (!isNotEmpty(email, 'Email')) {
                showError(emailInput, 'Поле "Email" обязательно для заполнения');
                hasError = true;
            } else if (!isValidEmail(email)) {
                showError(emailInput, 'Введите корректный email (например: name@domain.ru)');
                hasError = true;
            }

            // Проверка сообщения (минимум 10 символов)
            if (!isNotEmpty(message, 'Сообщение')) {
                showError(messageInput, 'Поле "Сообщение" обязательно для заполнения');
                hasError = true;
            } else if (message.length < 10) {
                showError(messageInput, 'Сообщение должно содержать не менее 10 символов (сейчас ' + message.length + ')');
                hasError = true;
            }

            // Если ошибок нет — показываем уведомление и очищаем форму
            if (!hasError) {
                showToast(); // Плавное зелёное всплывающее уведомление
                
                // Очищаем форму
                form.reset();
                
                // Дополнительно можно вывести данные в консоль (для отладки)
                console.log('✅ Обращение отправлено:', { 
                    name: name, 
                    email: email, 
                    message: message,
                    timestamp: new Date().toLocaleString()
                });
                
                // Можно также сохранить в localStorage (опционально)
                const submissions = JSON.parse(localStorage.getItem('feedbackSubmissions') || '[]');
                submissions.push({ name, email, message, date: new Date().toISOString() });
                localStorage.setItem('feedbackSubmissions', JSON.stringify(submissions));
            } else {
                console.log('❌ Форма содержит ошибки, отправка отменена');
            }
        });
    } else {
        console.warn('Форма с id="feedbackForm" не найдена на странице');
    }

    // Дополнительно: маска ввода для email (подсказка при фокусе)
    if (emailInput) {
        emailInput.addEventListener('focus', function() {
            if (this.value === '') {
                this.placeholder = 'example@mail.ru';
            }
        });
        
        emailInput.addEventListener('blur', function() {
            if (this.value === '') {
                this.placeholder = '';
            }
        });
    }

    // Гамбургер-меню для мобильных устройств
    const burgerBtn = document.getElementById('burgerBtn');
    const mainNav = document.querySelector('.main-nav');
    
    if (burgerBtn && mainNav) {
        burgerBtn.addEventListener('click', function() {
            mainNav.classList.toggle('open');
            // Меняем иконку гамбургера (опционально)
            if (mainNav.classList.contains('open')) {
                burgerBtn.textContent = '✕';
            } else {
                burgerBtn.textContent = '☰';
            }
        });
        
        // Закрываем меню при клике на ссылку (на телефонах)
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    mainNav.classList.remove('open');
                    if (burgerBtn) burgerBtn.textContent = '☰';
                }
            });
        });
    }

    // Подсветка активного пункта меню при прокрутке
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.main-nav a');
    
    if (sections.length > 0 && navLinks.length > 0) {
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.pageYOffset + 120; // смещение для шапки
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                const href = link.getAttribute('href');
                if (href === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
});