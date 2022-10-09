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
    

});