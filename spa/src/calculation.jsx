export function getIntervals(goals) {
	// seradim kombinovane cile podle doby trvani
	goals.sort((a, b) => {
		return a.months - b.months;
	});
	// pro kazdy kombinovany cil vytvorim Interval (aka splatkove obdobi)
	const intervals = goals.map((goal, i) => {
		return { month: goal.months, previousLower: false };
	});

	intervals.forEach((interval, i) => {
		const previousMonth = goals[i - 1] ? goals[i - 1].months : 0;
		interval.duration = interval.month - previousMonth;
		interval.payment = goals[i].amount / interval.duration;
		interval.goal = goals[i];

		if (intervals[i - 1] && (intervals[i - 1].payment < interval.payment)) {
			interval.previousLower = true;
		}
		interval.index = i;
	});
	return intervals;
}

/**
 * Vrati pole obdobi, na ktera budou splatky vzdy rozdeleny. Tj. takove, ktera maji nizsci splatku nez obdobi predchozi
 * 
 * @param {[Object]} goals Pole sloucenych cilu
 * @returns {[Object]} Pole obdobi, ktera budou ve vysledku
 */
export function getPeriods(goals) {
	return goals.map(g => g.months).filter((x, i, a) => a.indexOf(x) === i);
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

	return goalsCombined;
}

/**
 * Z mnoziny vsech moznych splatkovych intervalu vytvori novou, ktera muze obsahovat mene intervalu.
 * To se stane pokud:
 * - nasledujici interval ma vetsi splatku, nez ten pred nim
 * Takove jsou slouceny do jednoho. Jejich trvani je souctem vsech po sobe jdoucich intervalu, kde splatka pozdejsiho je vyssi
 * nez splatka predchoziho
 * @param {[Object]} intervals Vsechny splatkove intervaly vytvorene z dob splaceni kombinovaych cilu
 * @returns {[Object]} intervals Vysledne pole splatkovych intervalu, ve kterych se lisi velikost splatky 
 */
export function combineIntervals(intervals) {
	const periods = intervals.filter(i => !i.previousLower);
	periods.forEach((p, i) => {
		// zjistit si dalsi periodu, pred kterou se musim zastavit
		// K A1 mohu sloucit dalsi intervaly (B), pokud jsou splneny vsechny nasledujici podminky
		// - B nasleduje po A (porovnani indexu)
		// - B je pred dalsim obdobim, ktere nema vyssi splatku nez jeho predchudce, nebo je poslednim obdobim uplne
		// - B ma vyssi splatku nez predchozi interval
		p.toCombine = intervals.filter((interval, idx) => 
			interval.previousLower && interval.index > p.index && ((periods[i + 1] && periods[i + 1].index > interval.index) || !periods[i + 1])
		);
	});

	// vim, ktere obdobi budu kombinovat do jedne splatky, ted je sectu dohromady a nastavim delku nove vznikleho obdobi
	// pro vsechny nastavim sumu splatky a zacatek a konec splaceni
	periods.forEach((p, i) => {
		p.total = p.goal.amount;
		p.monthStart = p.month - p.duration + 1;
		if (p.toCombine && p.toCombine.length > 0) {
			// sectu castku vsech cilu, ktera musi byt zaplacena v techto obdobich, ktera kombinuji
			const toPay = p.toCombine.map(g => g.goal.amount).reduce(function (a, b) { return a + b; });
			// castku z kombinovanych obdobi prictu k castce obdobi, se kterym je kombinuju
			p.total += toPay; 
			// pote mohu spocitat celkovou splatku pro zkombinovana obdobi
			p.duration += p.toCombine.map(g => g.duration).reduce(function (a, b) { return a + b; });
			p.payment = p.total / p.duration;
			// zjistim posledni mesic splaceni tohoto sloucenoho obdobi
			const monthEnd = Math.max.apply(Math, p.toCombine.map(function (o) { return o.goal.months; }));
			p.monthStart = monthEnd - p.duration + 1;
			p.month = monthEnd;
		}
	});

	return periods;
}

export function getResults(goals) {
	if (!goals || goals.length === 0) {
		return null;
	}
	const combinedGoals = combineGoals(goals);
	const intervals = getIntervals(combinedGoals);
	const combinedIntervals = combineIntervals(intervals);
	const result = combinedIntervals.map(interval=>{
		const i = { monthStart: interval.monthStart, monthEnd: interval.month, payment: interval.payment};
		return i;
	});
	
	return result;
}
