const gregorian = require('./dateutils.gregorian');
const jalaali = require('./dateutils.jalaali');
const Moment = require('moment');


function sameMonth(type, a, b) {
  if (type === 'jalaali') {
    return jalaali.sameMonth(a, b);
  }
  return gregorian.sameMonth(a, b);
}

function sameDate(type, a, b) {
  if(!(a instanceof Moment) || !(b instanceof Moment)) {
    return false;
  }
  const aDate = a.toDate();
  const bDate = b.toDate();
  return aDate.getFullYear() === bDate.getFullYear() &&
      aDate.getMonth() === bDate.getMonth() &&
      aDate.getDate() === bDate.getDate();
}

function isGTE(type, a, b) {
  if (type === 'jalaali') {
    return jalaali.isGTE(a, b);
  }
  return gregorian.isGTE(a, b);
}

function isLTE(type, a, b) {
  if (type === 'jalaali') {
    return jalaali.isLTE(a, b);
  }
  return gregorian.isLTE(a, b);
}

function fromTo(type, a, b) {
  if (type === 'jalaali') {
    return jalaali.fromTo(a, b);
  }
  return gregorian.fromTo(a, b);
}

function month(type, xd) {
  if (type === 'jalaali') {
    return jalaali.month(xd);
  }
  return gregorian.month(xd);
}

function weekDayNames(type, firstDayOfWeek = 0) {
  if (type === 'jalaali') {
    return jalaali.weekDayNames(firstDayOfWeek);
  }
  return gregorian.weekDayNames(firstDayOfWeek);
}

function page(type, xd, firstDayOfWeek) {
  if (type === 'jalaali') {
    return jalaali.page(xd, firstDayOfWeek);
  }
  return gregorian.page(xd, firstDayOfWeek);
}

function rangeDate(type, date, range) {
  if (type === 'jalaali') {
    return jalaali.rangeDate(date, range);
  }
  return gregorian.rangeDate(date, range);
}

function formatMonthYear(type, date) {
/*  if (type === 'jalaali') {
    return jalaali.formatMonthYear(date);
  }*/
  return gregorian.formatMonthYear(date);
}

function monthYearFormat(type) {
  if (type === 'jalaali') {
    return jalaali.monthYearFormat();
  }
  return gregorian.monthYearFormat();
}

function diffMonths(type, date1, date2) {
  if (type === 'jalaali') {
    return jalaali.diffMonths(date1, date2);
  }
  return gregorian.diffMonths(date1, date2);
}

function firstDayOfMonth(type, date) {
  if (type === 'jalaali') {
    return jalaali.firstDayOfMonth(date);
  }
  return gregorian.firstDayOfMonth(date);
}

function addMonths(type, date, month) {
  if (type === 'jalaali') {
    return jalaali.addMonths(date, month);
  }
  return gregorian.addMonths(date, month);
}

function utc(type) {
  if (type === 'jalaali') {
    return jalaali.utc();
  }
  return gregorian.utc();
}

function weekNumber(type, date) {
  if (type === 'jalaali') {
    return jalaali.weekNumber(date);
  }
  return gregorian.weekNumber(date);
}

function dayOfMonth(type, date) {
  if (type === 'jalaali') {
    return jalaali.dayOfMonth(date);
  }
  return gregorian.dayOfMonth(date);
}

module.exports = {
  weekDayNames,
  sameMonth,
  sameDate,
  month,
  page,
  fromTo,
  isLTE,
  isGTE,
  rangeDate,
  formatMonthYear,
  monthYearFormat,
  diffMonths,
  firstDayOfMonth,
  addMonths,
  utc,
  weekNumber,
  dayOfMonth
};
