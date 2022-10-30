function tabs(tabsParentSelector, tabsContentSelector, tabsSelector, activeClass) {
    
    const tabsParent = document.querySelector(tabsParentSelector),
          tabContent = document.querySelectorAll(tabsContentSelector),
          tabs = document.querySelectorAll(tabsSelector);
          
    function hideTabContent() {
        tabContent.forEach(item => {
            item.classList.add("hide");
            item.classList.remove('show', 'fade');
        });

        tabs.forEach(tab => {
            tab.classList.remove(activeClass);
        });
    }

    function showTabContent(i = 0) {
        tabContent[i].classList.add('show', 'fade');
        tabs[i].classList.remove("hide");
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains(tabsSelector.slice(1))) {
            
            tabs.forEach((item,i) => {
                if ((item) == e.target) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
            
            
        }
    });

}

export default tabs;