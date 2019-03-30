const ListItemModel = function({ name }, id = '') {
    const li = document.createElement('li');
    li.classList.add(`zoo-type-and-search-list__item`, id);
    li.innerHTML = name;
    return li;
};

export { ListItemModel as ListItem };
