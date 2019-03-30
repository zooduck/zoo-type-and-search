import compareResults from '../../service/compareResults.service';

describe('compareResults', () => {
    it('should return a diff of true if the length of the two args is different', () => {
        const a = [1,2,3];
        const b = [1,2];

        expect(compareResults(a, b).diff).toBe(true);
    });
    it('should return a diff of true if the two arrays do not have exactly the same elements in the same order', () => {
        const a = [1, 2, 3, 'a', 'b', 'c'];
        const b = [1, 2, 3, 'a', 'c', 'b'];

        expect(compareResults(a, b).diff).toBe(true);
    });
    it('should return a diff of true if the two arrays have different elements', () => {
        const a = [1, 2, 3, 'a', 'b', 'c'];
        const b = [1, 2, 3, 'aa', 'b', 'c'];

        expect(compareResults(a, b).diff).toBe(true);
    });
    it('should return a diff of false if the two arrays have exactly the same elements in the same order', () => {
        const res1 = {id: 12, name: 'begemot'};
        const res2 = {id: 13, name: 'begemotik'};
        const a1 = [res1, res2];
        const b1 = [res1, res2];

        expect(compareResults(a1, b1).diff).toBe(false);

        const a2 = [1, 2, 3, 'a', 'b', 'c'];
        const b2 = [1, 2, 3, 'a', 'b', 'c'];

        expect(compareResults(a2, b2).diff).toBe(false);
    });
});
