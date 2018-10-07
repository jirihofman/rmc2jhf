import React, { Component } from 'react';
import i18n from 'i18next';
import { Grid, Glyphicon, Form, FormGroup, ControlLabel, FormControl, Button, Row, Col, PageHeader } from 'react-bootstrap';
import { getResults } from './calculation';
import ResultTable from './components/resultTable';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
			lang: 'en',
			calcDisabled: this.isCalcDisabled(),
			intervals: [],
			goals: [{ name: '', amount: 0, months: 0 }]
			//goals: [{ name: '', amount: 500, months: 10 }, { name: '', amount: 1000, months: 20 }]
		};
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	getValidationState(i, attr) {
		switch (attr) {
			case 'amount':
				if (this.state.goals[i].amount > 0) { return 'success'; }
				else { return 'error'; }
			case 'months':
				if (this.state.goals[i].months > 0) { return 'success'; }
				else { return 'error'; }
			default:
				if (this.state.goals[i].name !== '') { return 'success'; }
				else { return 'warning'; }
		}
	}

	/**
	 * Vykresli jeden Cil sporeni
	 * @param {Object} goal Cil sporeni
	 * @param {int} idx Poradi
	 * @returns {Row} Cil sporeni
	 */
	renderGoalInputs(goal, idx) {
		return (
			<Row key={idx} style={{ 'margin': '0.3em', 'display': 'inline' }}>
				<Col xs={12} md={5}>
					<FormGroup controlId={`name-${idx}`} validationState={this.getValidationState(idx, 'name')}>
						<ControlLabel>{i18n.t('goal')}</ControlLabel>
						<FormControl type="text" placeholder={i18n.t('goal')} value={goal.name} onChange={this.handleGoalNameChange.bind(this, idx, 'name')} />
					</FormGroup>
				</Col>
				<Col xs={5} md={2}>
					<FormGroup controlId={`amount-${idx}`} validationState={this.getValidationState(idx, 'amount')}>
						<ControlLabel>{i18n.t('goal-amount')}</ControlLabel>
						<FormControl type="number" placeholder="1000" step="1000" min="0" value={goal.amount} onChange={this.handleGoalNameChange.bind(this, idx, 'amount')} />
					</FormGroup>
				</Col>
				<Col xs={5} md={2}>
					<FormGroup controlId={`months-${idx}`} validationState={this.getValidationState(idx, 'months')}>
						<ControlLabel>{i18n.t('goal-months')}</ControlLabel>
						<FormControl type="number" placeholder="12" min="1" value={goal.months} onChange={this.handleGoalNameChange.bind(this, idx, 'months')} />
					</FormGroup>
				</Col>
				<Col xs={1} md={1}>
					<Button type="button" onClick={this.handleRemoveGoal.bind(this, idx)} bsStyle="danger" title={i18n.t('goal-remove')}><Glyphicon glyph="trash" /></Button>
				</Col>
			</Row>
		);
	}

	handleAddGoal() {
		this.setState({
			goals: this.state.goals.concat([{ name: '', amount: 0, months: 0 }])
		});
	}
	handleRemoveGoal(idx) {
		this.setState({
			goals: this.state.goals.filter((s, sidx) => idx !== sidx)
		});
	}
	handleGoalNameChange(idx, attr, evt) {
		const newgoals = this.state.goals.map((goal, sidx) => {
			if (idx !== sidx) { return goal; }
			switch (attr) {
				case 'amount':
					return { ...goal, amount: evt.target.value };
				case 'months':
					return { ...goal, months: evt.target.value };
				default:
					return { ...goal, name: evt.target.value };
			}
		});

		this.setState({ goals: newgoals, calcDisabled: this.isCalcDisabled() });
	}

	handleSubmit(event) {
		this.setState({ intervals: getResults(this.state.goals) });
	}

	/**
	 * Kdy bude tlacitko Proved vypocet neaktivni?
	 * - pokud nejaka castka nebo mesic, nebo pokud je mesic 0
	 * @returns {boolean} Muzeme provest vypocet?
	 */
	isCalcDisabled() {
		let disabled = true;
		if (this.state && this.state.goals && this.state.goals.length) {
			disabled = this.state.goals.some(g => isNaN(g.amount) || isNaN(g.months)) || this.state.goals.some(g => g.months < 1);
		}
		return disabled;
	}

	/**
	 * @returns {string} Popisek pro tlacitko Proved vypocet, pokud je disablovano
	 */
	getCalculateTitle() {
		if (this.isCalcDisabled()) {
			return i18n.t('calculate-disabled-title');
		} else {
			return null;
		}
	}

	render() {
		i18n.changeLanguage(this.state.lang);

		return (
			<Grid >
				<Row>
					<Col xs={12} md={8} mdOffset={2}>
						<PageHeader>
							{i18n.t('calculation-title')}
							<Button className="pull-right" onClick={() => this.setState({ lang: 'cs' })} bsSize='xsmall'><img src='./img/cz.png' alt='cz' width='16' /></Button>
							<Button className="pull-right" onClick={() => this.setState({ lang: 'en' })} bsSize='xsmall'><img src='./img/en.png' alt='en' width='16' /></Button>
						</PageHeader>
						<Form>
							<Row>
								<Button onClick={this.handleAddGoal.bind(this)} bsStyle="success" style={{ 'margin': '0.3em' }}><Glyphicon glyph="plus" /> {i18n.t('goal-add')}</Button>
							</Row>
							<Row>
								{this.state.goals.map((goal, i) => this.renderGoalInputs(goal, i))}
							</Row>
							<Row>
								<Button onClick={this.handleSubmit} bsStyle="primary" style={{ 'margin': '0.3em' }} disabled={this.isCalcDisabled()} title={this.getCalculateTitle()}>{i18n.t('do-calculation')}</Button>
							</Row>
						</Form>
						<ResultTable intervals={this.state.intervals}></ResultTable>
					</Col>

				</Row>
			</Grid>
		);
	}
}

export default Main;
