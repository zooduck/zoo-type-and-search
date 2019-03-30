const ListModel = (id = '') => {
    const ul = document.createElement('ul');
    ul.classList.add(`zoo-type-and-search-list`, id);
    return ul;
};

export { ListModel as List };
