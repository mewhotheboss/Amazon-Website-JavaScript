import { formatCurrency } from "../../scripts/utils/money.js";

// provided by jasemine and create a test suite 
describe('test suite: format currency', () => {
    // provided by jasmine and create a test
    it('converts cents into dollars', () => {
        // provided by jasmine which compare a value to another vaule
        expect(formatCurrency(2095)).toEqual('20.95');
    });

    it('works with 0', () => {
        expect(formatCurrency(0)).toEqual('0.00');
    });

    it('rounds up to the nearest cent', () => {
        expect(formatCurrency(2000.5)).toEqual('20.01');
    });
});