import { List } from '../model/List.model';
import { ListItem } from '../model/ListItem.model';
import style from '../service/style.service';
import compareResults from '../service/compareResults.service';
import adjustWidthToCompensateForBorders from '../service/adjustWidthToCompensateForBorders.service';

const ZooTypeAndSearch = function({ el, onKeyupHandler, onSelectHandler, debounce = 250 }) {
    const INIT = () => {
        VALIDATE_ARGS(el, onKeyupHandler, onSelectHandler);
        REGISTER_EVENT_LISTENERS();
        ADD_STYLES();
    };

    const VALIDATE_ARGS = (el, onKeyupHandler, onSelectHandler) => {
        if (!document.querySelector(el)) {
            throw new Error(`Could not find ${el} in document.`);
        }
        if (!onKeyupHandler || onKeyupHandler.constructor.name !== 'Function') {
            throw new Error(`${onKeyupHandler} is not a function.`);
        }
        if (!onSelectHandler || onSelectHandler.constructor.name !== 'Function') {
            throw new Error(`${onSelectHandler} is not a function.`);
        }
    };
    
    const id = el.substr(1);
    let lastKeyupDate;
    let typingActivityTimeout;
    let selectedResult = 0;
    let results = [];
    const list = new List(id);
    const inputEl = document.querySelector(el);

    const REGISTER_EVENT_LISTENERS = () => {
        window.addEventListener('resize', () => {
            SET_LIST_STYLES();
            adjustWidthToCompensateForBorders(list);
        });

        inputEl.addEventListener('keyup', (e) => {
             // Key is either Enter, Up or Down
            if (e.keyCode.toString().search(/(40|38|13)/) !== -1) {
                return;
            }
            // Input field is empty
            if (!e.target.value) {
                clearTimeout(typingActivityTimeout);
                return ON_KEYUP_HANDLER(e);
            }
            const nowDate = new Date().getTime();
            // Start monitoring user input
            if (!lastKeyupDate) {
                lastKeyupDate = new Date().getTime();
            }
            // Debounce keyup event
            if (typingActivityTimeout) {
                clearTimeout(typingActivityTimeout);
            }
            typingActivityTimeout = setTimeout(() => {
                ON_KEYUP_HANDLER(e);
            }, debounce);
            // Update
            lastKeyupDate = nowDate;
        });

        inputEl.addEventListener('click', (e) => {
            if (e.target.value) {
                ON_KEYUP_HANDLER(e);
            }
        });

        inputEl.addEventListener('keydown', (e) => {
            if (e.keyCode.toString().search(/^(40|38|13)$/) === -1) {
                selectedResult = undefined;
            }
            if (results.length) {
                if (e.keyCode === 40) {
                    if (selectedResult === undefined) {
                        selectedResult = 0;
                    } else if (e.keyCode == 40 && results[selectedResult + 1]) {
                        selectedResult += 1;
                    }
                    HIGHLIGHT_SELECTED_RESULT();
                }
                if (e.keyCode == 38 && results[selectedResult - 1]) {
                    selectedResult -= 1;
                    HIGHLIGHT_SELECTED_RESULT();
                }
                if (e.keyCode == 13) {
                    if (selectedResult !== undefined) {
                        ON_SELECT_HANDLER(list.children[selectedResult]);
                    }
                }
            }
        });

        inputEl.addEventListener('blur', () => {
            setTimeout(() => {
                REMOVE_LIST_FROM_DOM();
                CLEAR_LIST();
                results = [];
            }, 250); // Timeout necessary so the click handler for the list element has time to fire
        });
    };

    const ADD_STYLES = () => {
        style(id).inject();
    };

    const HIGHLIGHT_SELECTED_RESULT = () => {
        Array.from(list.children).forEach((item, index) => {
            if (index === selectedResult) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    };

    const ON_KEYUP_HANDLER = (e) => {
        if (!e.target.value) {
            lastKeyupDate = null;
            LIST_RESULTS([]);
        } else {
            try {
                const requestedVal = e.target.value;
                onKeyupHandler(e.target.value).then((results) => {
                    lastKeyupDate = null;
                    if (e.target === document.activeElement && e.target.value === requestedVal) {
                        LIST_RESULTS(results);
                    }
                }, (err) => {
                    console.error(err);
                });
            } catch (e) {
                console.error(e);
                console.error('onKeyupHandler must return a Promise.');
            }
        }
    };
    
    const SET_LIST_STYLES = () => {
        const inputBCR = inputEl.getBoundingClientRect();
        list.style.left = `${inputBCR.left}px`;
        list.style.top = `${inputBCR.top + inputBCR.height}px`;
        list.style.width = `${inputBCR.width}px`;
    };

    const ADD_LIST_TO_DOM = () => {
        REMOVE_LIST_FROM_DOM();
        SET_LIST_STYLES();
        document.body.appendChild(list);
        adjustWidthToCompensateForBorders(list);
    };

    const REMOVE_LIST_FROM_DOM = () => {
        if (list.parentNode) {
            list.parentNode.removeChild(list);
        }
    };

    const CLEAR_LIST = () => {
        list.innerHTML = '';
    };

    const ON_SELECT_HANDLER = () => {
        inputEl.value = results[selectedResult].name;
        REMOVE_LIST_FROM_DOM();
        CLEAR_LIST();
        onSelectHandler(results[selectedResult]);
        results = [];
    };

    const LIST_RESULTS = (res) => {
        if (!compareResults(res, results).diff) {
            // Do nothing, as the results have not changed
            return;
        }
        CLEAR_LIST();
        results = res;
        if (results.length === 0) {
            return REMOVE_LIST_FROM_DOM();
        }
        results.forEach((result, index) => {
            const li = new ListItem(result, id);
            li.addEventListener('click', () => {
                selectedResult = index;
                ON_SELECT_HANDLER();
            });
            list.appendChild(li);
        });
        ADD_LIST_TO_DOM();
    };

    // Init...
    INIT();

    return {
        get results() {
            return results;
        }
    }
};

export default ZooTypeAndSearch;
