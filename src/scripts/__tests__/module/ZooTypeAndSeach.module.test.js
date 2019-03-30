import { ZooTypeAndSearch } from "../../module/ZooTypeAndSearch.factory";

let fn, thenable;
beforeAll(() => {
    const interactiveInput = document.createElement('input');
    interactiveInput.setAttribute('name', 'interactive-input');
    document.body.appendChild(interactiveInput);
    thenable = () => new Promise((resolve) => resolve());
    fn = () => 'SUCCESS';
});

describe('ZooTypeAndSearch', () => {
    // ...
    describe('validateArgs', () => {
        // ...
        it('should throw an error if the element specified by the el arg does not exist', () => {
            const newInstanceMockA = () => {
                return ZooTypeAndSearch.create({
                    el: 'input[name="interactive-input-that-does-not-exist"]',
                    onKeyupHandler:  thenable,
                    onSelectHandler: fn
                });
            };
            expect(newInstanceMockA).toThrow(`Could not find input[name="interactive-input-that-does-not-exist"] in document.`);
        });
        // ...
        it('should throw an error if the onKeyupHandler arg is not a Function', () => {
            const newInstanceMockA = () => {
                return ZooTypeAndSearch.create({
                    el: 'input[name="interactive-input"]',
                    onSelectHandler: fn
                });
            };
            const newInstanceMockB = () => {
                return ZooTypeAndSearch.create({
                    el: 'input[name="interactive-input"]',
                    onSelectHandler: fn,
                    onKeyupHandler: 'Function'
                });
            };
            const newInstanceMockC = () => {
                return ZooTypeAndSearch.create({
                    el: 'input[name="interactive-input"]',
                    onSelectHandler: fn,
                    onKeyupHandler: {}
                });
            };
            expect(newInstanceMockA).toThrow(/^undefined is not a function.$/)
            expect(newInstanceMockB).toThrow(/^Function is not a function.$/);
            expect(newInstanceMockC).toThrow(/^\[object Object\] is not a function.$/);
        });
        // ...
        it('should throw an error if the onSelectHandler arg is not a Function', () => {
            const newInstanceMockA = () => {
                return ZooTypeAndSearch.create({
                    onKeyupHandler: thenable,
                    el: 'input[name="interactive-input"]'
                });
            };
            const newInstanceMockB = () => {
                return ZooTypeAndSearch.create({
                    onKeyupHandler: thenable,
                    el: 'input[name="interactive-input"]',
                    onSelectHandler: 'Function'
                });
            };
            const newInstanceMockC = () => {
                return ZooTypeAndSearch.create({
                    onKeyupHandler: thenable,
                    el: 'input[name="interactive-input"]',
                    onSelectHandler: [1, 2, 3]
                });
            }
            expect(newInstanceMockA).toThrow('undefined is not a function.');
            expect(newInstanceMockB).toThrow('Function is not a function.');
            expect(newInstanceMockC).toThrow('1,2,3 is not a function');
        });
    });
    // ...
    it('should return an object with a results getter', () => {
        const ztas = ZooTypeAndSearch.create({
            el: 'input[name="interactive-input"]',
            onKeyupHandler: thenable,
            onSelectHandler: fn
        });
        expect(ztas).toEqual({ results: [] });
    });
});
