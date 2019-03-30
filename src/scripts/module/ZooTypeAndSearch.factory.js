import ZooTypeAndSearch from './ZooTypeAndSearch.module';
import parseAttrs from '../service/parseAttrs.service';

const ZooTypeAndSearchFactory = (function() {
    if (document.readyState === 'complete') {
        parseAttrs();
    } else {
        document.addEventListener('readystatechange', () => {
            if (document.readyState === 'complete') {
                parseAttrs();
            }
        });
    }
    return {
        create({ el, onKeyupHandler, onSelectHandler, debounce }) {
            return new ZooTypeAndSearch({ el, onKeyupHandler, onSelectHandler, debounce });
        }
    }
})();

export { ZooTypeAndSearchFactory as ZooTypeAndSearch };
