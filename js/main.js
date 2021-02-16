let brand = document.querySelector('.form-contact-brand');
let model = document.querySelector('.form-contact-model');
let yearRelease = document.querySelector('.form-contact-year');


[brand, model, yearRelease].forEach((elm) => {
    let value = elm.querySelector('input').value;
    if (value.trim() !== '') {
        let p = elm.querySelector('.form-contact-select-p span');
        p.textContent = value;
        p.style.color = '#000';
    }
});


function formSelect(e, elm) {
    if (e.target.className === 'form-contact-select-dropdown__item') {
        let item = elm.querySelector('input');
        let p = elm.querySelector('.form-contact-select-p span');
        item.value = e.target.textContent;
        p.textContent = e.target.textContent;
        p.style.color = '#000';
        elm.classList.remove('active');
    }
    if (e.target.closest('.form-contact-select-p')) {
        if (elm.classList.contains('active')) {
            elm.classList.remove('active');
        } else {
            elm.classList.add('active');
        }
    }
}

brand.addEventListener('click', (e) => { formSelect(e, brand); });
model.addEventListener('click', (e) => { formSelect(e, model); });
yearRelease.addEventListener('click', (e) => { formSelect(e, yearRelease); });



let quickRequests = document.querySelectorAll('.quick-request');
let detailedRequests = document.querySelectorAll('.detailed-request');
let openForm = document.querySelectorAll('.open-modal-form');
let body = document.querySelector('body');
let modalConetnt = document.querySelector('.modal-content');
let modalTitle = modalConetnt.querySelector('.modal__title');
let modalSubtitle = modalConetnt.querySelector('.modal__subtitle');
let modalForm = modalConetnt.querySelector('.modal-form');
let modalClose = document.querySelector('.modal__close');

modalClose.addEventListener('click', () => {
    body.classList.remove('modal-open');
    modalForm.textContent = '';
    modalTitle.textContent = '';
    modalSubtitle.textContent = '';
});


function openModal() {
    body.classList.add('modal-open');
    modalForm.textContent = '';
    modalTitle.textContent = '';
    modalSubtitle.textContent = '';
}

function sendOk(response) {
    if (response === 'OK') {
        openModal();
        modalTitle.textContent = 'Спасибо за вашу заявку!';
        modalSubtitle.textContent = 'Мы свяжется с Вами в ближайшее время!';
    } else {
        sendError();
    }
}

function sendError() {
    openModal();
    modalTitle.textContent = 'Ошибка';
    modalSubtitle.textContent = 'Не удалось отправить заявку! Повторите попытку позже.';
}

function send(d) {
    new TDAjax({
        url: 'contacts.php',
        method: 'POST',
        data: d,
        success: function(response) { sendOk(response); },
        error: function() { sendError(); },
    });
}

function validate(wrap) {
    let errors = 0;
    let inputs = wrap.querySelectorAll('input, textarea');
    let phone_regexp = /^((8|\+374|\+994|\+995|\+375|\+7|\+380|\+38|\+996|\+998|\+993)[\- ]?)?\(?\d{3,5}\)?[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}[\- ]?\d{1}(([\- ]?\d{1})?[\- ]?\d{1})?$/;
    let email_regexp = /@/;
    function createError(wrap, elem, error, message) {
        elem.classList.add('input-error');
        if (!error) {
            error = document.createElement('p');
            error.classList.add('input-sub-error');
            error.textContent = message;
            wrap.append(error);
        } else { error.textContent = message; }

        errors += 1;
    }
    function removeError(elem, error) {
        elem.classList.remove('input-error');
        if (error) { error.remove(); }
    }

    for (var i = 0; i < inputs.length; i++) {
        let wrap = inputs[i].closest('.input-wrap');
        let error = wrap.querySelector('.input-sub-error');
        if (inputs[i].value.trim() !== '') {
            if (inputs[i].name === 'name' && error) { removeError(inputs[i], error); }
            if (inputs[i].name === 'phone') {
                if (phone_regexp.test(inputs[i].value)) { removeError(inputs[i], error); }
                else { createError(wrap, inputs[i], error, 'Введите корректный номер телефона'); }
            }
            if (inputs[i].name === 'brand' ||
                inputs[i].name === 'model' ||
                inputs[i].name === 'year'  ||
                inputs[i].name === 'details') { removeError(inputs[i], error); }
            if (inputs[i].name === 'email') {
                if (email_regexp.test(inputs[i].value)) { removeError(inputs[i], error); }
                else { createError(wrap, inputs[i], error, 'Введите корректный E-mail'); }
            }
        } else {
            createError(wrap, inputs[i], error, 'Поле не должно быть пустым!');
        }
    }
    if (errors === 0) { return true; }
    return false;
}

function serialize(inputs) {
    // @param inputs => type Array
    let params = [];
    let add = function (key, value) {
        if (key !== '') {
            let val;
            if (value) { val = value } else { val = '' }
            let param = encodeURIComponent(key) + "=" + encodeURIComponent(val);
            params.push(param);
        }
    };

    if (inputs == null) { return "" }

    inputs.forEach((elm) => {
        add(elm.name, elm.value);
    });

    return params.join('&');
}


modalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let inputs = e.target.querySelectorAll('input, textarea');
    if (validate(e.target)) {
        send(serialize(inputs));
    }
});
detailedRequests.forEach((elm) => {
    elm.addEventListener('submit', (e) => {
        e.preventDefault();
        let inputs = elm.querySelectorAll('input, textarea');
        if (validate(elm)) {
            send(serialize(inputs));
        }
    });
});
formTemplate = `
    <div class="modal-input-w input-wrap">
        <input class="modal__input" type="text" name="name" placeholder="Ваше имя">
        <img class="modal-input__icon" src="./img/user_icon.png" alt="">
    </div>
    <div class="modal-input-w input-wrap">
        <input class="modal__input" type="text" name="phone" placeholder="Ваш телефон">
        <img class="modal-input__icon" src="./img/phone_icon.png" alt="">
    </div>
`;
quickRequests.forEach((elm) => {
    elm.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
        modalTitle.textContent = 'Быстрая заявка';
        modalSubtitle.textContent = 'Оставьте заявку и мы Вам перезвоним!';
        modalForm.innerHTML = formTemplate + `
            <button type="submit" class="btn modal__btn">Отправить заявку</button>
        `;
    });
});
openForm.forEach((elm) => {
    elm.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
        modalTitle.textContent = 'Заказ обратного звонка';
        modalSubtitle.textContent = 'Оставьте заявку и мы Вам перезвоним!';
        modalForm.innerHTML = formTemplate +  `
            <div class="modal-input-w input-wrap">
                <input class="modal__input" type="text" name="email" placeholder="Ваш E-mail">
                <img class="modal-input__icon" src="./img/email_icon.png" alt="">
            </div>
            <button type="submit" class="btn modal__btn">Отправить заявку</button>
        `;
    });
});
