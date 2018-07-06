import React, {Component} from 'react';
import {
    View,
    ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';

import dateutils from '../dateutils';
import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import Day from './day/basic';
import UnitDay from './day/period';
import MultiDotDay from './day/multi-dot';
import MultiPeriodDay from './day/multi-period';
import SingleDay from './day/custom';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';

const Moment = require('moment');
const jMoment = require('moment-jalaali');

//Fallback when RN version is < 0.44
const viewPropTypes = ViewPropTypes || View.propTypes;

const EmptyArray = [];

class Calendar extends Component {
  static propTypes = {
        // Specify theme properties to override specific styles for calendar parts. Default = {}
    theme: PropTypes.object,
        // Collection of dates that have to be marked. Default = {}
    markedDates: PropTypes.object,

        // Specify style for calendar container element. Default = {}
    style: viewPropTypes.style,
        // Initially visible month. Default = Date()
    current: PropTypes.any,
        // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
    minDate: PropTypes.any,
        // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
    maxDate: PropTypes.any,

        // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
    firstDay: PropTypes.number,

        // Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple'
    markingType: PropTypes.string,

        // Hide month navigation arrows. Default = false
    hideArrows: PropTypes.bool,
        // Display loading indicador. Default = false
    displayLoadingIndicator: PropTypes.bool,
        // Do not show days of other months in month page. Default = false
    hideExtraDays: PropTypes.bool,

        // Handler which gets executed on day press. Default = undefined
    onDayPress: PropTypes.func,
        // Handler which gets executed on day long press. Default = undefined
    onDayLongPress: PropTypes.func,
        // Handler which gets executed when visible month changes in calendar. Default = undefined
    onMonthChange: PropTypes.func,
    onVisibleMonthsChange: PropTypes.func,
        // Replace default arrows with custom ones (direction can be 'left' or 'right')
    renderArrow: PropTypes.func,
        // Provide custom day rendering component
    dayComponent: PropTypes.any,
        // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
    monthFormat: PropTypes.string,
        // Disables changing month when click on days of other months (when hideExtraDays is false). Default = false
    disableMonthChange: PropTypes.bool,
        //  Hide day names. Default = false
    hideDayNames: PropTypes.bool,
        // Disable days by default. Default = false
    disabledByDefault: PropTypes.bool,
        // Show week numbers. Default = false
    showWeekNumbers: PropTypes.bool,
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
    onPressArrowLeft: PropTypes.func,
        // Handler which gets executed when press arrow icon left. It receive a callback can go next month
    onPressArrowRight: PropTypes.func,
        // Calendar type
    type: PropTypes.oneOf(['gregorian', 'jalaali']),
  };
  static defaultProps = {
    type: 'gregorian',
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    let currentMonth;
    if (props.current) {
      currentMonth = parseDate(props.type, props.current);
    } else {
      if (props.type === 'jalaali') {
        currentMonth = jMoment.utc();
      } else {
        currentMonth = Moment.utc();
      }
    }
    this.state = {
      currentMonth
    };

    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.pressDay = this.pressDay.bind(this);
    this.longPressDay = this.longPressDay.bind(this);
    this.shouldComponentUpdate = shouldComponentUpdate;
  }

  componentWillReceiveProps(nextProps) {
    const current = parseDate(nextProps.type, nextProps.current);
    if (current &&current.format('YYYY MM') !== this.state.currentMonth.format('YYYY MM')) {
      this.setState({
        currentMonth: current.clone()
      });
    }
  }

  updateMonth(day, doNotTriggerListeners) {
    if (day.format('YYYY MM') === this.state.currentMonth.format('YYYY MM')) {
      return;
    }
    this.setState({
      currentMonth: day.clone()
    }, () => {
      if (!doNotTriggerListeners) {
        const currMont = this.state.currentMonth.clone();
        if (this.props.onMonthChange) {
          this.props.onMonthChange(xdateToData(this.props.type, currMont));
        }
        if (this.props.onVisibleMonthsChange) {
          this.props.onVisibleMonthsChange([xdateToData(this.props.type, currMont)]);
        }
      }
    });
  }

  _handleDayInteraction(date, interaction) {
    const day = parseDate(this.props.type, date);
    const minDate = parseDate(this.props.type, this.props.minDate);
    const maxDate = parseDate(this.props.type, this.props.maxDate);
    if (!(minDate && !dateutils.isGTE(this.props.type, day, minDate)) && !(maxDate && !dateutils.isLTE(this.props.type, day, maxDate))) {
      const shouldUpdateMonth = this.props.disableMonthChange === undefined || !this.props.disableMonthChange;
      if (shouldUpdateMonth) {
        this.updateMonth(day);
      }
      if (interaction) {
        interaction(xdateToData(this.props.type, day));
      }
    }
  }

  pressDay(date) {
    this._handleDayInteraction(date, this.props.onDayPress);
  }

  longPressDay(date) {
    this._handleDayInteraction(date, this.props.onDayLongPress);
  }

  addMonth(count) {
    this.updateMonth(dateutils.addMonths(this.state.currentMonth, count));
  }

  renderDay(day, id) {
    const minDate = parseDate(this.props.type, this.props.minDate);
    const maxDate = parseDate(this.props.type, this.props.maxDate);
    let state = '';
    if (this.props.disabledByDefault) {
      state = 'disabled';
    } else if ((minDate && !dateutils.isGTE(this.props.type, day, minDate)) || (maxDate && !dateutils.isLTE(this.props.type, day, maxDate))) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(this.props.type, day, this.state.currentMonth)) {
      state = 'disabled';
    } else if (dateutils.sameDate(this.props.type, day, Moment.utc())) {
      state = 'today';
    }
    let dayComp;
    if (!dateutils.sameMonth(this.props.type, day, this.state.currentMonth) && this.props.hideExtraDays) {
      if (['period', 'multi-period'].includes(this.props.markingType)) {
        dayComp = (<View key={id} style={{flex: 1}}/>);
      } else {
        dayComp = (<View key={id} style={this.style.dayContainer}/>);
      }
    } else {
      const DayComp = this.getDayComponent();
      const date = this.props.type === 'jalaali' ? day.jDate() : day.date();
      dayComp = (
                <DayComp
                    key={id}
                    state={state}
                    type={this.props.type}
                    theme={this.props.theme}
                    onPress={this.pressDay}
                    onLongPress={this.longPressDay}
                    date={xdateToData(this.props.type, day)}
                    marking={this.getDateMarking(day)}
                >
                    {date}
                </DayComp>
            );
    }
    return dayComp;
  }

  getDayComponent() {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }

    switch (this.props.markingType) {
    case 'period':
      return UnitDay;
    case 'multi-dot':
      return MultiDotDay;
    case 'multi-period':
      return MultiPeriodDay;
    case 'custom':
      return SingleDay;
    default:
      return Day;
    }
  }

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }
    const dates = this.props.markedDates[day.format('YYYY-MM-DD')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  renderWeekNumber(weekNumber) {
    return <Day key={`week-${weekNumber}`} type={this.props.type} theme={this.props.theme}
                    marking={{disableTouchEvent: true}} state='disabled'>{weekNumber}</Day>;
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    }, this);

    if (this.props.showWeekNumbers) {
      const renderedWeekNumber = this.renderWeekNumber(days[days.length - 1]);
      week.unshift(this.props.type === 'jalaali' ? renderedWeekNumber.jWeek() : renderedWeekNumber.isoWeek());
    }

    return (<View style={this.style.week} key={id}>{week}</View>);
  }

  render() {
    const days = dateutils.page(this.props.type, this.state.currentMonth, this.props.firstDay);
    const weeks = [];
    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }
    let indicator;
    const current = parseDate(this.props.type, this.props.current);
    if (current) {
      const lastMonthOfDay = current.clone().add(1, 'months').date(1).add(-1,'days').format('YYYY-MM-DD');
      if (this.props.displayLoadingIndicator &&
                !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])) {
        indicator = true;
      }
    }
    return (
            <View style={[this.style.container, this.props.style]}>
                <CalendarHeader
                    type={this.props.type}
                    theme={this.props.theme}
                    hideArrows={this.props.hideArrows}
                    month={this.state.currentMonth}
                    addMonth={this.addMonth}
                    showIndicator={indicator}
                    firstDay={this.props.firstDay}
                    renderArrow={this.props.renderArrow}
                    monthFormat={this.props.monthFormat}
                    hideDayNames={this.props.hideDayNames}
                    weekNumbers={this.props.showWeekNumbers}
                    onPressArrowLeft={this.props.onPressArrowLeft}
                    onPressArrowRight={this.props.onPressArrowRight}
                />
                <View style={this.style.monthView}>{weeks}</View>
            </View>);
  }
}

export default Calendar;
