import * as calculation from '../calculation';

describe('Calculation', ()=>{
	describe('function getCalculation()', () => {
		it('when no input, returns null', () => {
			expect(calculation.getResults(null)).toBe(null);
		});
		it('when empty input, returns null', () => {
			expect(calculation.getResults([])).toBe(null);
		});
		it('when single goal, returns simple result', () => {
			const input = [{ name: 'Sphero BB-8', amount: 3000, months: 2}];
			const expected = [{monthStart: 1, monthEnd: 2, amount: 1500}];
			expect(calculation.getResults(input)).toEqual(expected);
		});
	});
});
