import Main from '../Main';
import React from 'react';
import i18next from 'i18next';
import { shallow } from 'enzyme';
import * as calculation from '../calculation';
import localization from '../localization';

describe('Main app', () => {
	let props = {};
	let wrapper = null;
	i18next.init({
		lng: 'cs', // defaultne cestina
		resources: localization,
		interpolation: { escapeValue: false }  // React already does escaping
	});
	beforeEach(() => {
		wrapper = shallow(<Main {...props} />);
	});
	it('calls getCalculation() when clicked the button [Calculate]', () => {
		calculation.getResults = jest.fn(() => 'getresults');
		wrapper.find('Button[bsStyle="primary"]').first().simulate('click'); // najdu prvni button a kliknu na nej, to zavola cely vypocet
		expect(calculation.getResults.mock.calls.length).toBe(1);
	});
	it('has [Add goal] Button', () => {
		expect(wrapper.exists('Button[bsStyle="success"]')).toBe(true);
	});
	it('has [Remove goal] Button', () => {
		expect(wrapper.exists('Button[bsStyle="danger"]')).toBe(true);
	});
	it('handleAddGoal() adds a goal', () => {
		wrapper.instance().handleAddGoal();
		expect(wrapper.state().goals.length).toBe(2);
	});
	it('handleRemoveGoal() removes a goal', () => {
		wrapper.instance().handleRemoveGoal(0); // odeberu Cil s indexem nula, tj. prvni
		expect(wrapper.state().goals.length).toBe(0);
	});
	it('handleGoalNameChange() sets Goal to: Sphero BB-8, 2499, 12', () => {
		wrapper.instance().handleGoalNameChange(0, 'name', { target: { value: 'Sphero BB-8'}});
		wrapper.instance().handleGoalNameChange(0, 'amount', { target: { value: 2499}});
		wrapper.instance().handleGoalNameChange(0, 'months', {target: {value: 12}});
		expect(wrapper.state().goals).toEqual([{ 'amount': 2499, 'months': 12, 'name': 'Sphero BB-8' }]);
	});
});
