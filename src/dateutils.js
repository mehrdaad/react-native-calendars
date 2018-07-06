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
  return a instanceof Moment && b instanceof Moment &&
        a.year() === b.year() &&
        a.month() === b.month() &&
        a.date() === b.date();
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
  if (type === 'jalaali') {
    return jalaali.formatMonthYear(date);
  }
  return gregorian.formatMonthYear(date);
}
function diffMonths(type, date1, date2)
{
  if (type === 'jalaali') {
    return jalaali.diffMonths(date1,date2);
  }
  return gregorian.diffMonths(date1,date2);
}
function firstDayOfMonth(type, date)
{
  if (type === 'jalaali') {
    return jalaali.firstDayOfMonth(date);
  }
  return gregorian.firstDayOfMonth(date);
}
function addMonths(type, date, month) {
  if (type === 'jalaali') {
    return jalaali.addMonths(date,month);
  }
  return gregorian.addMonths(date,month);
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
  diffMonths,
  firstDayOfMonth,
  addMonths
};
