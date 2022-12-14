import {getResource} from '../services/services';

function cards() {

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

    

    getResource('http://localhost:3000/menu')
        .then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new Cards(img, altimg, title, descr, price, '.menu .container').render();
            });
        });

}

export default cards;