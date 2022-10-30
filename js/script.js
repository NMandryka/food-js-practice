
import tabs from './modules/tabs';
import cards from './modules/cards';
import calculator from './modules/calculator';    
import modal from './modules/modal';
import slider from './modules/slider';
import timer from './modules/timer';
import forms from './modules/forms'; 
import {openModal} from './modules/modal';   

window.addEventListener('DOMContentLoaded', () => {

    const modalTimerId = setTimeout(() => openModal('.modal, modalTimerId'), 5000);

    tabs(".tabheader__items", ".tabcontent", ".tabheader__item", 'tabheader__item_active');
    cards();
    calculator();
    modal('[data-modal-close]', '[data-modal]', '.modal', modalTimerId);
    timer('.timer', '2022-11-15');
    forms('form', modalTimerId);
    slider({
        container: '.offer__slider',
        slide: '.offer__slide',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        totalCounter: '#total',
        currentCounter: '#current',
        wrapper: '.offer__slider-wrapper',
        field: '.offer__slider-inner'
    });

}); 