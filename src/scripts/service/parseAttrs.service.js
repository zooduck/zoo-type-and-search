import ZooTypeAndSearch from '../module/ZooTypeAndSearch.module';

const parseAttrs = () => {
    const ztasEls = Array.from(document.querySelectorAll('[ztas-keyup][ztas-select]'));
    ztasEls.forEach((inputEl) => {
        const debounce = inputEl.getAttribute('ztas-debounce');
        
        if (!inputEl.hasAttribute('id')) {
            inputEl.setAttribute('id', `_${(Math.random() * 100).toString().substr(3)}`);
        }

        new ZooTypeAndSearch({
            el: `#${inputEl.id}`,
            onKeyupHandler: eval(inputEl.getAttribute('ztas-keyup')),
            onSelectHandler: eval(inputEl.getAttribute('ztas-select')),
            debounce: debounce ? debounce : undefined
        });
    });
};

export default parseAttrs;
