import { ListItem } from '../model/ListItem.model';
import { List } from '../model/List.model';
import style from '../service/style.service';
import compareResults from '../service/compareResults.service';
import adjustWidthToCompensateForBorders from '../service/adjustWidthToCompensateForBorders.service';

// private methods...
const REGISTER_EVENT_LISTENERS = Symbol('REGISTER_EVENT_LISTENERS');
const ON_KEYUP_HANDLER = Symbol('ON_KEYUP_HANDLER');
const ON_SELECT_HANDLER = Symbol('ON_SELECT_HANDLER');
const VALIDATE_ARGS = Symbol('VALIDATE_ARGS');
const LIST_RESULTS = Symbol('LIST_RESULTS');
const ADD_LIST_TO_DOM = Symbol('ADD_LIST_TO_DOM');
const REMOVE_LIST_FROM_DOM = Symbol('REMOVE_LIST_FROM_DOM');
const SET_LIST_STYLES = Symbol('SET_LIST_STYLES');
const HIGHLIGHT_SELECTED_RESULT = Symbol('HIGHLIGHT_SELECTED_RESULT');
const ADD_STYLES = Symbol('ADD_STYLES');
const CLEAR_LIST = Symbol('CLEAR_LIST');

class ZooTypeAndSearch {
    constructor({ el, onKeyupHandler, onSelectHandler, debounce = 250 }) {
        this.id = el.substr(1);
        // "private" vars...
        this.__private__ = {
            el: document.querySelector(el),
            onKeyupHandler: onKeyupHandler,
            onSelectHandler: onSelectHandler,
            lastKeyupDate: undefined,
            typingActivityTimeout: undefined,
            selectedResult: 0,
            results: [],
            list: new List(this.id),
            debounce: parseInt(debounce),
        }
        // init...
        this[VALIDATE_ARGS](el, onKeyupHandler, onSelectHandler);
        this[REGISTER_EVENT_LISTENERS]();
        this[ADD_STYLES]();
    }

    [VALIDATE_ARGS](el, onKeyupHandler, onSelectHandler) {
        if (!document.querySelector(el)) {
            throw new Error(`Could not find ${el} in document.`);
        }
        if (!onKeyupHandler || onKeyupHandler.constructor.name !== 'Function') {
            throw new Error(`${onKeyupHandler} is not a function.`);
        }
        if (!onSelectHandler || onSelectHandler.constructor.name !== 'Function') {
            throw new Error(`${onSelectHandler} is not a function.`);
        }
    }

    [REGISTER_EVENT_LISTENERS]() {
        window.addEventListener('resize', () => {
            this[SET_LIST_STYLES]();
            adjustWidthToCompensateForBorders(this.__private__.list);
        });

        this.__private__.el.addEventListener('keyup', (e) => {
            // Key is either Enter, Up or Down
            if (e.keyCode.toString().search(/(40|38|13)/) !== -1) {
                return;
            }
            // Input field is empty
            if (!e.target.value) {
                clearTimeout(this.__private__.typingActivityTimeout);
                return this[ON_KEYUP_HANDLER](e);
            }
            const nowDate = new Date().getTime();
            // Start monitoring user input
            if (!this.__private__.lastKeyupDate) {
                this.__private__.lastKeyupDate = new Date().getTime();
            }
            // Debounce keyup event
            if (this.__private__.typingActivityTimeout) {
                clearTimeout(this.__private__.typingActivityTimeout);
            }
            this.__private__.typingActivityTimeout = setTimeout(() => {
                this[ON_KEYUP_HANDLER](e);
            }, this.__private__.debounce);
            // Update
            this.__private__.lastKeyupDate = nowDate;
        });

        this.__private__.el.addEventListener('click', (e) => {
            if (e.target.value) {
                this[ON_KEYUP_HANDLER](e);
            }
        });

        this.__private__.el.addEventListener('keydown', (e) => {
            if (e.keyCode.toString().search(/^(40|38|13)$/) === -1) {
                this.__private__.selectedResult = undefined;
            }
            if (this.__private__.results.length) {
                if (e.keyCode === 40) {
                    if (this.__private__.selectedResult === undefined) {
                        this.__private__.selectedResult = 0;
                    } else if (e.keyCode == 40 && this.__private__.results[this.__private__.selectedResult + 1]) {
                        this.__private__.selectedResult += 1;
                    }
                    this[HIGHLIGHT_SELECTED_RESULT]();
                }
                if (e.keyCode == 38 && this.__private__.results[this.__private__.selectedResult - 1]) {
                    this.__private__.selectedResult -= 1;
                    this[HIGHLIGHT_SELECTED_RESULT]();
                }
                if (e.keyCode == 13) {
                    if (this.__private__.selectedResult !== undefined) {
                        this[ON_SELECT_HANDLER](this.__private__.list.children[this.__private__.selectedResult]);
                    }
                }
            }
        });

        this.__private__.el.addEventListener('blur', () => {
            setTimeout(() => {
                this[REMOVE_LIST_FROM_DOM]();
                this[CLEAR_LIST]();
                this.__private__.results = [];
            }, 250);  // Timeout necessary so the click handler for the list element has time to fire
        });
    }

    [ADD_STYLES]() {
        style(this.id).inject();
    }

    [HIGHLIGHT_SELECTED_RESULT]() {
        Array.from(this.__private__.list.children).forEach((item, index) => {
            if (index === this.__private__.selectedResult) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    [ON_KEYUP_HANDLER](e) {
        if (!e.target.value) {
            this.__private__.lastKeyupDate = null;
            this[LIST_RESULTS]([]);
        } else {
            try {
                const requestedVal = e.target.value;
                this.__private__.onKeyupHandler(e.target.value).then((results) => {
                    this.__private__.lastKeyupDate = null;
                    if (e.target === document.activeElement && e.target.value === requestedVal) {
                        this[LIST_RESULTS](results);
                    }
                }, (err) => {
                    console.error(err);
                });
            } catch (e) {
                console.error(e);
                console.error('onKeyupHandler must return a Promise.');
            }
        }
    }

    [SET_LIST_STYLES]() {
        const inputBCR = this.__private__.el.getBoundingClientRect();
        this.__private__.list.style.left = `${inputBCR.left}px`;
        this.__private__.list.style.top = `${inputBCR.top + inputBCR.height}px`;
        this.__private__.list.style.width = `${inputBCR.width}px`;
    }

    [ADD_LIST_TO_DOM]() {
        this[REMOVE_LIST_FROM_DOM]();
        this[SET_LIST_STYLES]();
        document.body.appendChild(this.__private__.list);
        adjustWidthToCompensateForBorders(this.__private__.list);
    }

    [REMOVE_LIST_FROM_DOM]() {
        if (this.__private__.list.parentNode) {
            this.__private__.list.parentNode.removeChild(this.__private__.list);
        }
    }

    [CLEAR_LIST]() {
        this.__private__.list.innerHTML = '';
    }

    [ON_SELECT_HANDLER]() {
        this.__private__.el.value = this.__private__.results[this.__private__.selectedResult].name;
        this[REMOVE_LIST_FROM_DOM]();
        this[CLEAR_LIST]();
        this.__private__.onSelectHandler(this.__private__.results[this.__private__.selectedResult]);
        this.__private__.results = [];
    }

    [LIST_RESULTS](results) {
        if (!compareResults(results, this.__private__.results).diff) {
            // Do nothing, as the the results have not changed
            return;
        }
        this[CLEAR_LIST]();
        this.__private__.results = results;
        if (results.length === 0) {
            return this[REMOVE_LIST_FROM_DOM]();
        }
        results.forEach((result, index) => {
            const li = new ListItem(result, this.id);
            li.addEventListener('click', () => {
                this.__private__.selectedResult = index;
                this[ON_SELECT_HANDLER]();
            });
            this.__private__.list.appendChild(li);
        });
        this[ADD_LIST_TO_DOM]();
    }
};

export default ZooTypeAndSearch;
