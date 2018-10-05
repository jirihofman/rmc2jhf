import * as calculation from '../calculation';

describe('Calculation', ()=>{
	describe('function getResults()', () => {
		it('when no input, returns null', () => {
			expect(calculation.getResults(null)).toBe(null);
		});
		it('when empty input, returns null', () => {
			expect(calculation.getResults([])).toBe(null);
		});
		it('when single goal, returns simple result', () => {
			const input = [{ name: 'Sphero BB-8', amount: 3000, months: 2}];
			const expected = [{monthStart: 1, monthEnd: 2, payment: 1500}];
			expect(calculation.getResults(input)).toEqual(expected);
		});
		it('Mobil + Laptop', () => {
			const input = [{ name: 'Notebook', amount: 60000, months: 12 }, { name: 'Mobil', amount: 9000, months: 24 }];
			const expected = [{ monthStart: 1, monthEnd: 12, payment: 5000 }, { monthStart: 13, monthEnd: 24, payment: 750 }];
			expect(calculation.getResults(input)).toEqual(expected);
		});
		it('Auto + Mobil + Dovolena', () => {
			const input = [{ name: 'Auto', amount: 400000, months: 60 }, { name: 'Mobil', amount: 8000, months: 12 }, { name: 'Dovolena', amount: 30000, months: 10 }];
			const expected = [{ monthStart: 1, monthEnd: 60, payment: 7300 }];
			expect(calculation.getResults(input)).toEqual(expected);
		});
	});
});
