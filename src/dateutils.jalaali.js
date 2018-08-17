const Moment = require('moment');
const jMoment = require('moment-jalaali-react-native-calendar');
const enLocale = require('moment/locale/en-gb');

function sameMonth(a, b) {
  return a instanceof Moment && b instanceof Moment &&
        a.jYear() === b.jYear() &&
        a.jMonth() === b.jMonth();
}

function isGTE(a, b) {
  return b.diff(a, 'days') < 1;
}

function isLTE(a, b) {
  return a.diff(b, 'days') < 1;
}

function fromTo(a, b) {
  const days = [];
  let from = +a, to = +b;
  for (; from <= to; from = new jMoment(from).add(1, 'days').valueOf()) {
    days.push(new jMoment(from).locale('en-gb', enLocale));
  }
  return days;
}

function month(xd) {
  const year = xd.jYear(), month = xd.jMonth();
  const days = jMoment.jDaysInMonth(year, month);

  const str = year + '-' + (month + 1);
  const firstDay = jMoment.utc(str + '-1T00:00:00', 'jYYYY-jM-jDTHH:mm:ss');
  const lastDay = jMoment.utc(str + '-' + days + 'T00:00:00', 'jYYYY-jM-jDTHH:mm:ss');

  return fromTo(firstDay, lastDay);
}

function weekDayNames(firstDayOfWeek = 0) {
  let weekDaysNames = jMoment.weekdaysMin();
  const dayShift = (firstDayOfWeek - 1) % 7;
  if (dayShift) {
    weekDaysNames = weekDaysNames.slice(dayShift).concat(weekDaysNames.slice(0, dayShift));
  }
  return weekDaysNames;
}

function dayOfWeek(xd) {
  return ((xd.day() + 1) % 7);
}

function page(xd, firstDayOfWeek) {
  const days = month(xd);
  let before = [], after = [];

  const fdow = ((7 + firstDayOfWeek) % 7) || 7;
  const ldow = (fdow + 6) % 7;

  firstDayOfWeek = firstDayOfWeek || 0;

  const from = days[0].clone();
  if (dayOfWeek(from) !== fdow) {
    from.add(-(dayOfWeek(from) + 7 - fdow) % 7, 'days');
  }

  const to = days[days.length - 1].clone();
  const day = dayOfWeek(to);
  if (day !== ldow) {
    to.add((ldow + 7 - day) % 7, 'days');
  }

  if (isLTE(from, days[0])) {
    before = fromTo(from, days[0]);
  }

  if (isGTE(to, days[days.length - 1])) {
    after = fromTo(days[days.length - 1], to);
  }

  return before.concat(days.slice(1, days.length - 1), after);
}

function rangeDate(date, range) {
  return date.clone().add(range, 'jMonths');
}

function formatMonthYear(date) {
  return date.format('jMMMM jYYYY');
}

function monthYearFormat() {
  return 'jMMMM jYYYY';
}

function diffMonths(date1, date2) {
  return date1.diff(date2, 'jMonths');
}

function firstDayOfMonth(date) {
  return date.clone().jDate(1);
}

function addMonths(date, month) {
  return date.clone().add(month, 'jMonths');
}

function utc() {
  return jMoment().utc();
}

function weekNumber(date) {
  return date.jWeek();
}

function dayOfMonth(date) {
  return date.jDate();
}

module.exports = {
  weekDayNames,
  sameMonth,
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
