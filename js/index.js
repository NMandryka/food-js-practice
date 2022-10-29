window.addEventListener('DOMContentLoaded', () => {


    //Tabs
    const tabsParent = document.querySelector(".tabheader__items"),
          tabContent = document.querySelectorAll(".tabcontent"),
          tabs = document.querySelectorAll(".tabheader__item");
          
    function hideTabContent() {
        tabContent.forEach(item => {
            item.classList.add("hide");
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove('tabheader__item_active');
        });
    }

    function showTabContent(i = 0) {
        tabContent[i].classList.add('show', 'fade');
        tabs[i].classList.remove("hide");
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains("tabheader__item")) {
            
            tabs.forEach((item,i) => {
                if ((item) == e.target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
            
            
        }
    });
    
    // timer 
    
    const deadline = '2022-10-15';

    function getTimeReamaining(endtime) {

        let days, hours, minutes, seconds;
        const time = Date.parse(endtime) - Date.parse(new Date());

        if (time <=0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        } else {
            days = Math.floor(time / (1000 * 60 * 60 * 24));
            hours = Math.floor((time / (1000 * 60 * 60)) % 24);
            minutes = Math.floor((time / (1000 * 60)) % 60);
            seconds =  Math.floor((time / 1000) % 60);
        }
              

        return {
            'total': time,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds,
        };
    }

    function getZero(num) {
        if (num >= 0 && num < 10) {
            return `0${num}`;
        } else {
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
        days = timer.querySelector('#days'),
        hours = timer.querySelector('#hours'),
        minutes = timer.querySelector('#minutes'),
        seconds = timer.querySelector('#seconds'),
        timeInterval = setInterval(updateClock, 1000);

        updateClock();

        function updateClock() {
            const t = getTimeReamaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0) {
                clearInterval(timeInterval);
            }
        }
    }

    setClock('.timer', deadline);


    // modal

    const modalOpenBtn = document.querySelectorAll('[data-modal'),
          modalCloseBtn = document.querySelector('[data-modal-close]'),
          modal = document.querySelector('.modal');

    function closeModal() {
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    } 
        
    function openModal() {
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);
    }

    modalOpenBtn.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    modalCloseBtn.addEventListener('click', closeModal);
    
    modal.addEventListener('click', (e) => {
        if(e.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if(e.code === 'Escape') {
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 5000);

    function showModalByScroll() {
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }

    window.addEventListener('scroll', showModalByScroll);



    //creater cards using class

    class Cards {

        constructor (src, alt, title, decsr, price, parentSelector) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.decsr = decsr;
            this.price = price;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAN();
        }  

        changeToUAN() {
            this.price *= this.transfer;
        }

        render() {
            const element = document.createElement('div');
            element.innerHTML = `
            <div class="menu__item">
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.decsr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            </div>
            `;
            this.parent.append(element);
        }

    }

    const getResource = async (url) => {
        const res = await fetch(url);

        if(!res.ok) {
            throw new Error(`Could not fetch ${url}, status ${res.status}`);
        }

        return await res.json();
    };

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new Cards(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

    
    // forms

    const forms = document.querySelectorAll('form');
    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо! Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    };

    forms.forEach(item => {
        bindPostData(item);
    });

    const postData = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: data
        });
        return await res.json();
    };

    function bindPostData(form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display: block;
                margin: 0 auto;
            `;
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postData('http://localhost:3000/requests', json)
            .then(data => {
                console.log(data);
                showThanksModal(message.success);
                statusMessage.remove();
            }).catch(() => {
                showThanksModal(message.failure);
            }).finally(() => {
                form.reset();
            });

        });
    }

    function showThanksModal(message) {
        const prevModalDialog = document.querySelector('.modal__dialog');

        prevModalDialog.classList.add('hide');
        openModal();

        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector('.modal').append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000);
    }


    // slider

    let offset = 0;
    let slideIndex = 1;

    const slides = document.querySelectorAll('.offer__slide'),
        slider = document.querySelector('.offer__slider'),
        prev = document.querySelector('.offer__slider-prev'),
        next = document.querySelector('.offer__slider-next'),
        total = document.querySelector('#total'),
        current = document.querySelector('#current'),
        slidesWrapper = document.querySelector('.offer__slider-wrapper'),
        width = window.getComputedStyle(slidesWrapper).width,
        slidesField = document.querySelector('.offer__slider-inner');

    if (slides.length < 10) {
        total.textContent = `0${slides.length}`;
        current.textContent =  `0${slideIndex}`;
    } else {
        total.textContent = slides.length;
        current.textContent =  slideIndex;
    }
    
    slidesField.style.width = 100 * slides.length + '%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = '0.5s all';

    slidesWrapper.style.overflow = 'hidden';

    slides.forEach(slide => {
        slide.style.width = width;
    });

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];
    indicators.classList.add('carousel-indicators');
    indicators.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 15;
        display: flex;
        justify-content: center;
        margin-right: 15%;
        margin-left: 15%;
        list-style: none;
    `;
    slider.append(indicators);

    for (let i = 0; i < slides.length; i++) {
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i + 1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;
        `;
        if (i == 0) {
            dot.style.opacity = 1;
        }
        indicators.append(dot);
        dots.push(dot);
    }

    next.addEventListener('click', () => {
        if (offset == (getDigitsFromString(width) * (slides.length - 1))) {
            offset = 0;
        } else {
            offset += getDigitsFromString(width); 
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == slides.length) {
            slideIndex = 1;
        } else {
            slideIndex++;
        }

        shouldAddZeroBeforeNumberInCurrentSlide();

        setActiveDot(dots);
    });

    prev.addEventListener('click', () => {
        if (offset == 0) {
            offset = getDigitsFromString(width) * (slides.length - 1);
        } else {
            offset -= getDigitsFromString(width);
        }

        slidesField.style.transform = `translateX(-${offset}px)`;

        if (slideIndex == 1) {
            slideIndex = slides.length;
        } else {
            slideIndex--;
        }

        shouldAddZeroBeforeNumberInCurrentSlide();

        setActiveDot(dots);
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideTo = e.target.getAttribute('data-slide-to');

            slideIndex = slideTo;
            offset = getDigitsFromString(width) * (slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            shouldAddZeroBeforeNumberInCurrentSlide();

            setActiveDot(dots);
        });
    });

    function shouldAddZeroBeforeNumberInCurrentSlide() {
        if (slides.length < 10) {
            current.textContent =  `0${slideIndex}`;
        } else {
            current.textContent =  slideIndex;
        }
    }

    function setActiveDot(dots) {
        dots.forEach(dot => dot.style.opacity = ".5");
        dots[slideIndex-1].style.opacity = 1;
    }

    function getDigitsFromString(str) {
        return +str.replace(/\D/g,'');
    }


    // calculator

    const result = document.querySelector('.calculating__result span');
    let sex = 'female',
     height, weight, age, 
     ratio = 1.375;

    function calcTotal() {

        if (!sex || !height || !weight || !age || !ratio) {
            result.textContent = '___';
            return;
        }

        if(sex == 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    } 

    calcTotal();

    function getDataFromStaticEl(parentSelector, activeClass) {
        const elements = document.querySelectorAll(`${parentSelector} div`);

        document.querySelector(parentSelector).addEventListener('click', (e) => {
            if(e.target.getAttribute('data-ratio')) {
                ratio = +e.target.getAttribute('data-ratio');
            } else {
                sex = e.target.getAttribute('id');
            }

            elements.forEach(elem => {
                elem.classList.remove(activeClass);

                if(e.target && e.target.classList.contains('calculating__choose-item')) {
                    e.target.classList.add(activeClass);
                    calcTotal();
                }

            });

        });

        
    }

    function getDataFromInput(selector) {
        const input = document.querySelector(selector);

        input.addEventListener('input', () => {

            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight': 
                    weight = +input.value;
                    break;
                case 'age': 
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
        
    }

    getDataFromStaticEl('#gender', 'calculating__choose-item_active');
    getDataFromStaticEl('.calculating__choose_big', 'calculating__choose-item_active');

    getDataFromInput('#age');
    getDataFromInput('#height');
    getDataFromInput('#weight');


}); 