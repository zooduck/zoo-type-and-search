const compareResults = (a = [], b = []) => {
    let diff;
    if (a.length !== b.length) {
        diff = true;
    } else {
        const compare = a.filter((item, index) => {
            return b[index] == item;
        });
        diff = compare.length !== a.length;
    }
    return {
        get diff() {
            return diff;
        }
    }
};

export default compareResults;
