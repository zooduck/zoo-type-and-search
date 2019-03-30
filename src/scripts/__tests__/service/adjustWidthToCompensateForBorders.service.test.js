import adjustWidthToCompensateForBorders from '../../service/adjustWidthToCompensateForBorders.service';

describe('adjustWidthToCompensateForBorders', () => {
    it('should reduce the computed width of the element by the combined horizontal width of the borders', () => {
        const  list = document.createElement('ul');
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
});
