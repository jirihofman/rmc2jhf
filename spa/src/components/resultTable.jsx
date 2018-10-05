import React, { Component } from 'react';
import { Grid, Row } from 'react-bootstrap';
import i18n from 'i18next';

class ResultTable extends Component {

	renderTableRow(interval) {
		if (!interval) {
			return null;
		} else {
			return <div>{interval.monthStart}. - {interval.monthEnd}. {i18n.t('calculation-month')} = {interval.payment} {i18n.t('czk')}</div>;
		}
	}

	render() {
		const intervals = this.props.intervals;

		if (!intervals || intervals.length === 0) {
			return null;
		}
		return (
			<Grid fluid>
				<h1>{i18n.t('calculation-results')}</h1>
				{intervals.map((interval, idx) => {
					return <Row key={idx}>
						{this.renderTableRow(interval)}
					</Row>;
				})}
			</Grid>
		);
	}
}

export default ResultTable;
