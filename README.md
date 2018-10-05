# rmc2jhf


function getResults(goals) {
	console.log('getResults');
	
	if (!goals || goals.length === 0) {
		return null;
	}
	let result = [];

	goals.map((goal, i) => {
		console.log('Cil %s', i, goal);
	})
	goals.sort((a, b) => {
		return a.months - b.months
	})
	goals.map((goal, i) => {
		console.log('serazeno %s', i, goal);
	})

	const intervals = goals.map((goal, i) => {
		return {month: goal.months, total: 0, min: 0}
	});
	console.log('intervals', intervals)

	const total = goals.map(g=>g.amount).reduce((a, b) => a + b, 0);
	const duration = Math.max.apply(Math, goals.map(function(o) { return o.months; }))
	console.log('total %s, duration %s', total, duration)

	intervals.forEach((interval, i)=>{
	    interval.min = goals.map((g,j)=>{if (i>=j) {return g.amount} else {return 0}}).reduce((a, b) => a + b, 0);
	    interval.previousMonth = goals[i-1] ? goals[i-1].months : 0;
	    interval.duration = interval.month -  interval.previousMonth;
	    delete interval.previousMonth;
	    interval.paymentMin = goals[i].amount / interval.duration;
	    console.log('foreach intervatl', i, interval);
	})
    paymentsAscending = intervals.every((value, i)=> value.paymentMin > (intervals[i-1] ? intervals[i-1].paymentMin : 0));
	console.log('jsou splatky vzrustajici?', paymentsAscending);
	if (paymentsAscending){
	    return [{ monthStart: 1, monthEnd: 2, amount: total / duration}]
	} else {
	    // splatky nejsou vzrustajici, budou se menit, nemuzeme to zprumerovat
	    
	}
    
	return [{ monthStart: 1, monthEnd: 2, amount: 1500 }];
}
getResults([{ name: 'Sphero BB-8', amount: 30000, months: 10}, { name: 'Auto', amount: 8000, months: 12}, { name: 'Letadlo', amount: 400000, months: 60}]);
