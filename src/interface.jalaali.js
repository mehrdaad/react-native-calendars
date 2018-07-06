const moment = require('moment-jalaali');
moment.loadPersian({
  usePersianDigits: true,
  dialect: 'persian-modern'
});
const isJalaali = true;

function padNumber(n) {
  if (n < 10) {
    return '0' + n;
  }
  return n;
}

function xdateToData(momentInstance) {
  const dateString = momentInstance.format('jYYYY-jMM-jDD');
  return {
    year: momentInstance.jYear(),
    month: momentInstance.jMonth() + 1,
    day: momentInstance.jDate(),
    timestamp: moment.utc(dateString,'jYYY-jMM-jDD').valueOf(),
    dateString: dateString
  };
}


function parseDate(d) {
  if (!d) {
    return;
  } else if (d.timestamp) { // conventional data timestamp
    return moment.utc(d.timestamp);
  } else if (d instanceof moment) { // xdate
    return moment.utc(d.format('YYYY-MM-DD'));
  } else if (d.getTime) { // javascript date
    const dateString = d.getFullYear() + '-' + padNumber((d.getMonth() + 1)) + '-' + padNumber(d.getDate());
    return moment.utc(dateString);
  } else if (d.year) {
    const dateString = d.year + '-' + padNumber(d.month) + '-' + padNumber(d.day);
    return moment.utc(dateString);
  } else if (d) { // timestamp nuber or date formatted as string
    return moment.utc(d);
  }
}

module.exports = {
  xdateToData,
  parseDate
};

