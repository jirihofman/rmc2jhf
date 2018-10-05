export function getIntervals(goals) {
	console.log('getResults');

	if (!goals || goals.length === 0) {
		return null;
	}
	goals.map((goal, i) => {
		console.log('Cil %s', i, goal);
	});
	goals.sort((a, b) => {
		return a.months - b.months;
	});
	goals.map((goal, i) => {
		console.log('serazeno %s', i, goal);
	});

	const intervals = goals.map((goal, i) => {
		return { month: goal.months, min: 0, previousLower: false };
	});
	console.log('intervals', intervals);

	const total = goals.map(g => g.amount).reduce((a, b) => a + b, 0);
	const duration = Math.max.apply(Math, goals.map(function (o) { return o.months; }));
	console.log('total %s, duration %s', total, duration);

	intervals.forEach((interval, i) => {
		interval.min = goals.map((g, j) => { if (i >= j) { return g.amount; } else { return 0; } }).reduce((a, b) => a + b, 0);
		interval.previousMonth = goals[i - 1] ? goals[i - 1].months : 0;
		interval.duration = interval.month - interval.previousMonth;
		delete interval.previousMonth;
		interval.paymentMin = goals[i].amount / interval.duration;
		interval.goal = goals[i];

		if (intervals[i - 1] && (intervals[i - 1].paymentMin < interval.paymentMin)) {
			console.log('pro predchozi interval je nizsi splatka', intervals[i - 1].paymentMin, interval.paymentMin);
			interval.previousLower = true;
		}
		interval.index = i;
		console.log('foreach intervatl', i, interval);
	});
	return intervals;
}

export function getPeriods(goals) {
	const months = goals.map(g => g.months).filter((x, i, a) => a.indexOf(x) === i);
	console.log(months);
	return months;
}

// sloucim ty cile, ktere trvaji stejne dlouho. Muzu je brat jako jeden
export function combineGoals(goals) {
	const months = getPeriods(goals);
	let goalsCombined = months.map(m => {
		let g = {};
		// dohledam cile, ktere se maji splatit na konci tohoto obdobi
		const toPay = goals.filter(g => g.months === m).map(g => g.amount).reduce(function (a, b) { return a + b; });
		g.amount = toPay;
		g.months = m;
		return g;
	});

	console.log(goalsCombined);
	return goalsCombined;
}

export function combineIntervals(intervals) {
	const periods = intervals.filter(i => !i.previousLower);
	periods.forEach((p, i) => {
		// zjistit si dalsi periodu, pred kterou se musim zstavit
		console.log('jsem v %s a dalsi je %s', i, periods[i + 1]);
		p.toCombine = intervals.filter((interval, idx) => {
			if (interval.previousLower && interval.index > p.index && ((periods[i + 1] && periods[i + 1].index > interval.index) || !periods[i + 1])) {
				console.log('pridavam', interval.index, interval, p);
				return true;
			}
		});
	});

	// vim, ktere obdobi budu kombinovat do jedne splatky, ted je sectu dohromady a nastavim delku nove vznikleho obdobi
	periods.forEach((p, i) => {
		p.total = p.goal.amount;
		p.monthStart = p.month - p.duration + 1;
		if (p.toCombine && p.toCombine.length > 0) {
			console.log('budeme slucovat obdobi a splatky', p, p.toCombine);
			const toPay = p.toCombine.map(g => g.goal.amount).reduce(function (a, b) { return a + b; });
			console.log('+ ', toPay, p);
			p.total += toPay;
			p.duration += p.toCombine.map(g => g.duration).reduce(function (a, b) { return a + b; });
			p.paymentMin = p.total / p.duration;
			// zjistim posledni mesic splaceni tohoto sloucenoho obdobi
			const monthEnd = Math.max.apply(Math, p.toCombine.map(function (o) { return o.goal.months; }));
			p.monthStart = monthEnd - p.duration + 1;
			p.month = monthEnd;
		}
	});

	return periods;
}

export function getResults(combinedIntervals) {
	const result = combineIntervals(getIntervals(combineGoals(combinedIntervals)));
	console.log(result);
	
	return result;
	
}
