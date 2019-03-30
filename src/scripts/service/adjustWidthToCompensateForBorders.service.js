const adjustWidthToCompensateForBorders = (el) => {
    const computedStyle = getComputedStyle(el);
    const borderLeftWidth = parseFloat(computedStyle.getPropertyValue('border-left-width'));
    const borderRightWidth = parseFloat(computedStyle.getPropertyValue('border-right-width'));
    const width = parseFloat(computedStyle.getPropertyValue('width'));
    el.style.width = `${width - (borderLeftWidth + borderRightWidth)}px`;
};

export default adjustWidthToCompensateForBorders;
