exports.dateFormat = function(date, format) {
	var o = {
		"Q+": Math.floor((date.getMonth() + 3) / 3), //quarter
		"M+": date.getMonth() + 1, //month
		"D+": date.getDate(), //day
		"h+": date.getHours(), //hour
		"m+": date.getMinutes(), //minute
		"s+": date.getSeconds(), //second
		S: date.getMilliseconds() //millisecond
	};
	if (/(Y+)/.test(format))
		format = format.replace(
			RegExp.$1,
			(date.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	for (var k in o)
		if (new RegExp("(" + k + ")").test(format))
			format = format.replace(
				RegExp.$1,
				RegExp.$1.length == 1
					? o[k]
					: ("00" + o[k]).substr(("" + o[k]).length)
			);
	return format;
};
