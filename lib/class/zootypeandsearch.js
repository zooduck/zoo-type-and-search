'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

var ListItemModel = function ListItemModel(_ref) {
  var name = _ref.name;
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
  var li = document.createElement('li');
  li.classList.add("zoo-type-and-search-list__item", id);
  li.innerHTML = name;
  return li;
};

var ListModel = function ListModel() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var ul = document.createElement('ul');
  ul.classList.add("zoo-type-and-search-list", id);
  return ul;
};

var style = function style() {
  var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
  var styleEl = document.createElement('style');
  var rules = [".zoo-type-and-search-list.".concat(id, " {\n            position: absolute;\n            list-style-type: none;\n            margin: 0;\n            padding: 0;\n            background-color: #F5F5F5; /* whitesmoke */\n            border: solid 1px #DCDCDC; /* gainsboro */\n            border-top-width: 0;\n        }"), ".zoo-type-and-search-list__item.".concat(id, " {\n            padding: 0 5px;\n            cursor: pointer;\n        }"), ".zoo-type-and-search-list__item.".concat(id, ":hover,\n        .zoo-type-and-search-list__item.").concat(id, ".selected {\n            background-color: #DCDCDC; /* gainsboro */\n        }")];
  return {
    inject: function inject() {
      document.head.insertBefore(styleEl, document.head.childNodes[0]);
      rules.forEach(function (rule) {
        return styleEl.sheet.insertRule(rule);
      });
    }
  };
};

var compareResults = function compareResults() {
  var a = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var b = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var diff;

  if (a.length !== b.length) {
    diff = true;
  } else {
    var compare = a.filter(function (item, index) {
      return b[index] == item;
    });
    diff = compare.length !== a.length;
  }

  return {
    get diff() {
      return diff;
    }

  };
};

var adjustWidthToCompensateForBorders = function adjustWidthToCompensateForBorders(el) {
  var computedStyle = getComputedStyle(el);
  var borderLeftWidth = parseFloat(computedStyle.getPropertyValue('border-left-width'));
  var borderRightWidth = parseFloat(computedStyle.getPropertyValue('border-right-width'));
  var width = parseFloat(computedStyle.getPropertyValue('width'));
  el.style.width = "".concat(width - (borderLeftWidth + borderRightWidth), "px");
};

var REGISTER_EVENT_LISTENERS = Symbol('REGISTER_EVENT_LISTENERS');
var ON_KEYUP_HANDLER = Symbol('ON_KEYUP_HANDLER');
var ON_SELECT_HANDLER = Symbol('ON_SELECT_HANDLER');
var VALIDATE_ARGS = Symbol('VALIDATE_ARGS');
var LIST_RESULTS = Symbol('LIST_RESULTS');
var ADD_LIST_TO_DOM = Symbol('ADD_LIST_TO_DOM');
var REMOVE_LIST_FROM_DOM = Symbol('REMOVE_LIST_FROM_DOM');
var SET_LIST_STYLES = Symbol('SET_LIST_STYLES');
var HIGHLIGHT_SELECTED_RESULT = Symbol('HIGHLIGHT_SELECTED_RESULT');
var ADD_STYLES = Symbol('ADD_STYLES');
var CLEAR_LIST = Symbol('CLEAR_LIST');

var ZooTypeAndSearch =
/*#__PURE__*/
function () {
  function ZooTypeAndSearch(_ref) {
    var el = _ref.el,
        onKeyupHandler = _ref.onKeyupHandler,
        onSelectHandler = _ref.onSelectHandler,
        _ref$debounce = _ref.debounce,
        debounce = _ref$debounce === void 0 ? 250 : _ref$debounce;

    _classCallCheck(this, ZooTypeAndSearch);

    this.id = el.substr(1); // "private" vars...

    this.__private__ = {
      el: document.querySelector(el),
      onKeyupHandler: onKeyupHandler,
      onSelectHandler: onSelectHandler,
      lastKeyupDate: undefined,
      typingActivityTimeout: undefined,
      selectedResult: 0,
      results: [],
      list: new ListModel(this.id),
      debounce: parseInt(debounce) // init...

    };
    this[VALIDATE_ARGS](el, onKeyupHandler, onSelectHandler);
    this[REGISTER_EVENT_LISTENERS]();
    this[ADD_STYLES]();
  }

  _createClass(ZooTypeAndSearch, [{
    key: VALIDATE_ARGS,
    value: function value(el, onKeyupHandler, onSelectHandler) {
      if (!document.querySelector(el)) {
        throw new Error("Could not find ".concat(el, " in document."));
      }

      if (!onKeyupHandler || onKeyupHandler.constructor.name !== 'Function') {
        throw new Error("".concat(onKeyupHandler, " is not a function."));
      }

      if (!onSelectHandler || onSelectHandler.constructor.name !== 'Function') {
        throw new Error("".concat(onSelectHandler, " is not a function."));
      }
    }
  }, {
    key: REGISTER_EVENT_LISTENERS,
    value: function value() {
      var _this = this;

      window.addEventListener('resize', function () {
        _this[SET_LIST_STYLES]();

        adjustWidthToCompensateForBorders(_this.__private__.list);
      });

      this.__private__.el.addEventListener('keyup', function (e) {
        // Key is either Enter, Up or Down
        if (e.keyCode.toString().search(/(40|38|13)/) !== -1) {
          return;
        } // Input field is empty


        if (!e.target.value) {
          clearTimeout(_this.__private__.typingActivityTimeout);
          return _this[ON_KEYUP_HANDLER](e);
        }

        var nowDate = new Date().getTime(); // Start monitoring user input

        if (!_this.__private__.lastKeyupDate) {
          _this.__private__.lastKeyupDate = new Date().getTime();
        } // Debounce keyup event


        if (_this.__private__.typingActivityTimeout) {
          clearTimeout(_this.__private__.typingActivityTimeout);
        }

        _this.__private__.typingActivityTimeout = setTimeout(function () {
          _this[ON_KEYUP_HANDLER](e);
        }, _this.__private__.debounce); // Update

        _this.__private__.lastKeyupDate = nowDate;
      });

      this.__private__.el.addEventListener('click', function (e) {
        if (e.target.value) {
          _this[ON_KEYUP_HANDLER](e);
        }
      });

      this.__private__.el.addEventListener('keydown', function (e) {
        if (e.keyCode.toString().search(/^(40|38|13)$/) === -1) {
          _this.__private__.selectedResult = undefined;
        }

        if (_this.__private__.results.length) {
          if (e.keyCode === 40) {
            if (_this.__private__.selectedResult === undefined) {
              _this.__private__.selectedResult = 0;
            } else if (e.keyCode == 40 && _this.__private__.results[_this.__private__.selectedResult + 1]) {
              _this.__private__.selectedResult += 1;
            }

            _this[HIGHLIGHT_SELECTED_RESULT]();
          }

          if (e.keyCode == 38 && _this.__private__.results[_this.__private__.selectedResult - 1]) {
            _this.__private__.selectedResult -= 1;

            _this[HIGHLIGHT_SELECTED_RESULT]();
          }

          if (e.keyCode == 13) {
            if (_this.__private__.selectedResult !== undefined) {
              _this[ON_SELECT_HANDLER](_this.__private__.list.children[_this.__private__.selectedResult]);
            }
          }
        }
      });

      this.__private__.el.addEventListener('blur', function () {
        setTimeout(function () {
          _this[REMOVE_LIST_FROM_DOM]();

          _this[CLEAR_LIST]();

          _this.__private__.results = [];
        }, 250); // Timeout necessary so the click handler for the list element has time to fire
      });
    }
  }, {
    key: ADD_STYLES,
    value: function value() {
      style(this.id).inject();
    }
  }, {
    key: HIGHLIGHT_SELECTED_RESULT,
    value: function value() {
      var _this2 = this;

      Array.from(this.__private__.list.children).forEach(function (item, index) {
        if (index === _this2.__private__.selectedResult) {
          item.classList.add('selected');
        } else {
          item.classList.remove('selected');
        }
      });
    }
  }, {
    key: ON_KEYUP_HANDLER,
    value: function value(e) {
      var _this3 = this;

      if (!e.target.value) {
        this.__private__.lastKeyupDate = null;
        this[LIST_RESULTS]([]);
      } else {
        try {
          var requestedVal = e.target.value;

          this.__private__.onKeyupHandler(e.target.value).then(function (results) {
            _this3.__private__.lastKeyupDate = null;

            if (e.target === document.activeElement && e.target.value === requestedVal) {
              _this3[LIST_RESULTS](results);
            }
          }, function (err) {
            console.error(err);
          });
        } catch (e) {
          console.error(e);
          console.error('onKeyupHandler must return a Promise.');
        }
      }
    }
  }, {
    key: SET_LIST_STYLES,
    value: function value() {
      var inputBCR = this.__private__.el.getBoundingClientRect();

      this.__private__.list.style.left = "".concat(inputBCR.left, "px");
      this.__private__.list.style.top = "".concat(inputBCR.top + inputBCR.height, "px");
      this.__private__.list.style.width = "".concat(inputBCR.width, "px");
    }
  }, {
    key: ADD_LIST_TO_DOM,
    value: function value() {
      this[REMOVE_LIST_FROM_DOM]();
      this[SET_LIST_STYLES]();
      document.body.appendChild(this.__private__.list);
      adjustWidthToCompensateForBorders(this.__private__.list);
    }
  }, {
    key: REMOVE_LIST_FROM_DOM,
    value: function value() {
      if (this.__private__.list.parentNode) {
        this.__private__.list.parentNode.removeChild(this.__private__.list);
      }
    }
  }, {
    key: CLEAR_LIST,
    value: function value() {
      this.__private__.list.innerHTML = '';
    }
  }, {
    key: ON_SELECT_HANDLER,
    value: function value() {
      this.__private__.el.value = this.__private__.results[this.__private__.selectedResult].name;
      this[REMOVE_LIST_FROM_DOM]();
      this[CLEAR_LIST]();

      this.__private__.onSelectHandler(this.__private__.results[this.__private__.selectedResult]);

      this.__private__.results = [];
    }
  }, {
    key: LIST_RESULTS,
    value: function value(results) {
      var _this4 = this;

      if (!compareResults(results, this.__private__.results).diff) {
        // Do nothing, as the the results have not changed
        return;
      }

      this[CLEAR_LIST]();
      this.__private__.results = results;

      if (results.length === 0) {
        return this[REMOVE_LIST_FROM_DOM]();
      }

      results.forEach(function (result, index) {
        var li = new ListItemModel(result, _this4.id);
        li.addEventListener('click', function () {
          _this4.__private__.selectedResult = index;

          _this4[ON_SELECT_HANDLER]();
        });

        _this4.__private__.list.appendChild(li);
      });
      this[ADD_LIST_TO_DOM]();
    }
  }]);

  return ZooTypeAndSearch;
}();

var ZooTypeAndSearch$1 = function ZooTypeAndSearch(_ref) {
  var el = _ref.el,
      onKeyupHandler = _ref.onKeyupHandler,
      onSelectHandler = _ref.onSelectHandler,
      _ref$debounce = _ref.debounce,
      debounce = _ref$debounce === void 0 ? 250 : _ref$debounce;

  var INIT = function INIT() {
    VALIDATE_ARGS(el, onKeyupHandler, onSelectHandler);
    REGISTER_EVENT_LISTENERS();
    ADD_STYLES();
  };

  var VALIDATE_ARGS = function VALIDATE_ARGS(el, onKeyupHandler, onSelectHandler) {
    if (!document.querySelector(el)) {
      throw new Error("Could not find ".concat(el, " in document."));
    }

    if (!onKeyupHandler || onKeyupHandler.constructor.name !== 'Function') {
      throw new Error("".concat(onKeyupHandler, " is not a function."));
    }

    if (!onSelectHandler || onSelectHandler.constructor.name !== 'Function') {
      throw new Error("".concat(onSelectHandler, " is not a function."));
    }
  };

  var id = el.substr(1);
  var lastKeyupDate;
  var typingActivityTimeout;
  var selectedResult = 0;
  var results = [];
  var list = new ListModel(id);
  var inputEl = document.querySelector(el);

  var REGISTER_EVENT_LISTENERS = function REGISTER_EVENT_LISTENERS() {
    window.addEventListener('resize', function () {
      SET_LIST_STYLES();
      adjustWidthToCompensateForBorders(list);
    });
    inputEl.addEventListener('keyup', function (e) {
      // Key is either Enter, Up or Down
      if (e.keyCode.toString().search(/(40|38|13)/) !== -1) {
        return;
      } // Input field is empty


      if (!e.target.value) {
        clearTimeout(typingActivityTimeout);
        return ON_KEYUP_HANDLER(e);
      }

      var nowDate = new Date().getTime(); // Start monitoring user input

      if (!lastKeyupDate) {
        lastKeyupDate = new Date().getTime();
      } // Debounce keyup event


      if (typingActivityTimeout) {
        clearTimeout(typingActivityTimeout);
      }

      typingActivityTimeout = setTimeout(function () {
        ON_KEYUP_HANDLER(e);
      }, debounce); // Update

      lastKeyupDate = nowDate;
    });
    inputEl.addEventListener('click', function (e) {
      if (e.target.value) {
        ON_KEYUP_HANDLER(e);
      }
    });
    inputEl.addEventListener('keydown', function (e) {
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
    inputEl.addEventListener('blur', function () {
      setTimeout(function () {
        REMOVE_LIST_FROM_DOM();
        CLEAR_LIST();
        results = [];
      }, 250); // Timeout necessary so the click handler for the list element has time to fire
    });
  };

  var ADD_STYLES = function ADD_STYLES() {
    style(id).inject();
  };

  var HIGHLIGHT_SELECTED_RESULT = function HIGHLIGHT_SELECTED_RESULT() {
    Array.from(list.children).forEach(function (item, index) {
      if (index === selectedResult) {
        item.classList.add('selected');
      } else {
        item.classList.remove('selected');
      }
    });
  };

  var ON_KEYUP_HANDLER = function ON_KEYUP_HANDLER(e) {
    if (!e.target.value) {
      lastKeyupDate = null;
      LIST_RESULTS([]);
    } else {
      try {
        var requestedVal = e.target.value;
        onKeyupHandler(e.target.value).then(function (results) {
          lastKeyupDate = null;

          if (e.target === document.activeElement && e.target.value === requestedVal) {
            LIST_RESULTS(results);
          }
        }, function (err) {
          console.error(err);
        });
      } catch (e) {
        console.error(e);
        console.error('onKeyupHandler must return a Promise.');
      }
    }
  };

  var SET_LIST_STYLES = function SET_LIST_STYLES() {
    var inputBCR = inputEl.getBoundingClientRect();
    list.style.left = "".concat(inputBCR.left, "px");
    list.style.top = "".concat(inputBCR.top + inputBCR.height, "px");
    list.style.width = "".concat(inputBCR.width, "px");
  };

  var ADD_LIST_TO_DOM = function ADD_LIST_TO_DOM() {
    REMOVE_LIST_FROM_DOM();
    SET_LIST_STYLES();
    document.body.appendChild(list);
    adjustWidthToCompensateForBorders(list);
  };

  var REMOVE_LIST_FROM_DOM = function REMOVE_LIST_FROM_DOM() {
    if (list.parentNode) {
      list.parentNode.removeChild(list);
    }
  };

  var CLEAR_LIST = function CLEAR_LIST() {
    list.innerHTML = '';
  };

  var ON_SELECT_HANDLER = function ON_SELECT_HANDLER() {
    inputEl.value = results[selectedResult].name;
    REMOVE_LIST_FROM_DOM();
    CLEAR_LIST();
    onSelectHandler(results[selectedResult]);
    results = [];
  };

  var LIST_RESULTS = function LIST_RESULTS(res) {
    if (!compareResults(res, results).diff) {
      // Do nothing, as the results have not changed
      return;
    }

    CLEAR_LIST();
    results = res;

    if (results.length === 0) {
      return REMOVE_LIST_FROM_DOM();
    }

    results.forEach(function (result, index) {
      var li = new ListItemModel(result, id);
      li.addEventListener('click', function () {
        selectedResult = index;
        ON_SELECT_HANDLER();
      });
      list.appendChild(li);
    });
    ADD_LIST_TO_DOM();
  }; // Init...


  INIT();
  return {
    get results() {
      return results;
    }

  };
};

var parseAttrs = function parseAttrs() {
  var ztasEls = Array.from(document.querySelectorAll('[ztas-keyup][ztas-select]'));
  ztasEls.forEach(function (inputEl) {
    var debounce = inputEl.getAttribute('ztas-debounce');

    if (!inputEl.hasAttribute('id')) {
      inputEl.setAttribute('id', "_".concat((Math.random() * 100).toString().substr(3)));
    }

    new ZooTypeAndSearch$1({
      el: "#".concat(inputEl.id),
      onKeyupHandler: eval(inputEl.getAttribute('ztas-keyup')),
      onSelectHandler: eval(inputEl.getAttribute('ztas-select')),
      debounce: debounce ? debounce : undefined
    });
  });
};

var ZooTypeAndSearchFactory = function () {
  if (document.readyState === 'complete') {
    parseAttrs();
  } else {
    document.addEventListener('readystatechange', function () {
      if (document.readyState === 'complete') {
        parseAttrs();
      }
    });
  }

  return {
    create: function create(_ref) {
      var el = _ref.el,
          onKeyupHandler = _ref.onKeyupHandler,
          onSelectHandler = _ref.onSelectHandler,
          debounce = _ref.debounce;
      return new ZooTypeAndSearch({
        el: el,
        onKeyupHandler: onKeyupHandler,
        onSelectHandler: onSelectHandler,
        debounce: debounce
      });
    }
  };
}();

window.zootypeandsearch = ZooTypeAndSearchFactory;
