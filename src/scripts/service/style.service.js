const style = (id = '') => {
    const styleEl = document.createElement('style');
    const rules = [
        `.zoo-type-and-search-list.${id} {
            position: absolute;
            list-style-type: none;
            margin: 0;
            padding: 0;
            background-color: #F5F5F5; /* whitesmoke */
            border: solid 1px #DCDCDC; /* gainsboro */
            border-top-width: 0;
        }`,
        `.zoo-type-and-search-list__item.${id} {
            padding: 0 5px;
            cursor: pointer;
        }`,
        `.zoo-type-and-search-list__item.${id}:hover,
        .zoo-type-and-search-list__item.${id}.selected {
            background-color: #DCDCDC; /* gainsboro */
        }`,
    ];
   
    return {
        inject() {
            document.head.insertBefore(styleEl, document.head.childNodes[0]);
            rules.forEach(rule => styleEl.sheet.insertRule(rule));
        }
    }
};

export default style;
