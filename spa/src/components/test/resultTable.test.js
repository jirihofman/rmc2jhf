import ResultTable from '../resultTable';
import React from 'react';
import { shallow } from 'enzyme';

describe('Result table component', () => {
	let props = [];
	let wrapper = null;
	beforeEach(() => {
		props = {intervals: [
			{ monthStart: 1, monthEnd: 2, amount: 1500 },
			{ monthStart: 3, monthEnd: 10, amount: 300 }
		]};
		wrapper = shallow(<ResultTable {...props} />);
	});
	it('is empty when no data', () => {
		props = null; // tabulka nedostane zadna data
		wrapper = shallow(<ResultTable {...props} />);
		expect(wrapper.get(0)).toBe(null);
	});
	it('matches snapshot', () => {
		expect(wrapper).toMatchSnapshot();
	});
	it('renderTableRow() is empty', () => {
		expect(wrapper.instance().renderTableRow()).toBe(null);
	});
});
