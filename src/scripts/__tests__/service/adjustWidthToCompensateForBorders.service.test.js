import adjustWidthToCompensateForBorders from '../../service/adjustWidthToCompensateForBorders.service';

describe('adjustWidthToCompensateForBorders', () => {
    it('should reduce the width of the ul element by the combined horizontal width of the borders, if the ul element does not have a box-sizing of \"border-box\"', () => {
        const  list = document.createElement('ul');
        list.style.boxSizing = 'content-box';
        list.style.width = '150px';
        list.style.borderLeftWidth = '50px';
        list.style.borderRightWidth =  '20px';
        adjustWidthToCompensateForBorders(list);
        expect(list.style.width).toBe('80px');

        list.style.width = '150px';
        list.style.border = '0 solid coral';
        adjustWidthToCompensateForBorders(list);
        expect(list.style.width).toBe('150px');
    });
    it('should not change the width of the ul element if the ul element has a box-sizing of \"border-box\"', () => {
        const  list = document.createElement('ul');
        list.style.boxSizing = 'border-box';
        list.style.width = '150px';
        list.style.borderLeftWidth = '50px';
        list.style.borderRightWidth =  '20px';
        adjustWidthToCompensateForBorders(list);
        expect(list.style.width).toBe('150px');

        list.style.width = '150px';
        list.style.border = '0 solid coral';
        adjustWidthToCompensateForBorders(list);
        expect(list.style.width).toBe('150px');
    });
});
