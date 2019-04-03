export function dateFormat(date: Date, format: string) {
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
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      const v = (o as any)[k];
      format = format.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? v : ("00" + v).substr(("" + v).length)
      );
    }
  }
  return format;
}
