import React, {Component} from 'react';
import {
    FlatList, Platform, Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {xdateToData, parseDate} from '../interface';
import styleConstructor from './style';
import dateutils from '../dateutils';
import Calendar from '../calendar';
import CalendarListItem from './item';

const Moment = require('moment');
const jMoment = require('moment-jalaali');

const {width} = Dimensions.get('window');

class CalendarList extends Component {
  static propTypes = {
    ...Calendar.propTypes,

        // Max amount of months allowed to scroll to the past. Default = 50
    pastScrollRange: PropTypes.number,

        // Max amount of months allowed to scroll to the future. Default = 50
    futureScrollRange: PropTypes.number,

        // Enable or disable scrolling of calendar list
    scrollEnabled: PropTypes.bool,

        // Enable or disable vertical scroll indicator. Default = false
    showScrollIndicator: PropTypes.bool,

        // When true, the calendar list scrolls to top when the status bar is tapped. Default = true
    scrollsToTop: PropTypes.bool,

        // Enable or disable paging on scroll
    pagingEnabled: PropTypes.bool,

        // Used when calendar scroll is horizontal, default is device width, pagination should be disabled
    calendarWidth: PropTypes.number,

        // Whether the scroll is horizontal
    horizontal: PropTypes.bool,
        // Dynamic calendar height
    calendarHeight: PropTypes.number,
  };

  static defaultProps = {
    horizontal: false,
    calendarWidth: width,
    calendarHeight: 360,
    pastScrollRange: 50,
    futureScrollRange: 50,
    showScrollIndicator: false,
    scrollEnabled: true,
    scrollsToTop: false,
    removeClippedSubviews: Platform.OS === 'android' ? false : true,
  }

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);

    const rows = [];
    const texts = [];
    let date;
    if (props.type === 'jalaali') {
      date = parseDate(props.type, props.current) || jMoment.utc();
    }
    else {
      date = parseDate(props.type, props.current) || Moment.utc();
    }
    for (let i = 0; i <= this.props.pastScrollRange + this.props.futureScrollRange; i++) {
      const rangeDate = dateutils.rangeDate(this.props.type, date, i - this.props.pastScrollRange);
      const rangeDateStr = dateutils.formatMonthYear(this.props.type, rangeDate);
      console.log('rangeDateStr');
      console.log(rangeDateStr);
      console.log('rangeDate');
      console.log(rangeDate);
      
      
      texts.push(rangeDateStr);
            /*
             * This selects range around current shown month [-0, +2] or [-1, +1] month for detail calendar rendering.
             * If `this.pastScrollRange` is `undefined` it's equal to `false` or 0 in next condition.
             */
      if (this.props.pastScrollRange - 1 <= i && i <= this.props.pastScrollRange + 1 || !this.props.pastScrollRange && i <= this.props.pastScrollRange + 2) {
        rows.push(rangeDate);
      } else {
        rows.push(rangeDateStr);
      }
    }

    this.state = {
      rows,
      texts,
      openDate: date
    };

    this.onViewableItemsChangedBound = this.onViewableItemsChanged.bind(this);
    this.renderCalendarBound = this.renderCalendar.bind(this);
    this.getItemLayout = this.getItemLayout.bind(this);
    this.onLayout = this.onLayout.bind(this);
  }

  onLayout(event) {
    if (this.props.onLayout) {
      this.props.onLayout(event);
    }
  }

  scrollToDay(d, offset, animated) {
    const day = parseDate(this.props.type, d);
    const firstDayOfOpenDateMonth = dateutils.firstDayOfMonth(this.props.type, this.state.openDate);
    const firstDayOfDayMonth = dateutils.firstDayOfMonth(this.props.type, day);
    const diffMonths = Math.round(dateutils.diffMonths(this.props.type, firstDayOfOpenDateMonth, firstDayOfDayMonth));
    const size = this.props.horizontal ? this.props.calendarWidth : this.props.calendarHeight;
    let scrollAmount = (size * this.props.pastScrollRange) + (diffMonths * size) + (offset || 0);
    if (!this.props.horizontal) {
      let week = 0;
      const days = dateutils.page(this.props.type, day, this.props.firstDay);
      for (let i = 0; i < days.length; i++) {
        week = Math.floor(i / 7);
        if (dateutils.sameDate(this.props.type, days[i], day)) {
          scrollAmount += 46 * week;
          break;
        }
      }
    }
    this.listView.scrollToOffset({offset: scrollAmount, animated});
  }

  scrollToMonth(m) {
    const month = parseDate(this.props.type, m);
    const scrollTo = month || this.state.openDate;
    const firstDayOfOpenDate = dateutils.firstDayOfMonth(this.props.type, this.state.openDate);
    const firstDayOfScrollTo = dateutils.firstDayOfMonth(this.props.type, scrollTo);
    let diffMonths = Math.round(dateutils.diffMonths(this.props.type, firstDayOfOpenDate, firstDayOfScrollTo));
    const size = this.props.horizontal ? this.props.calendarWidth : this.props.calendarHeight;
    const scrollAmount = (size * this.props.pastScrollRange) + (diffMonths * size);
        //console.log(month, this.state.openDate);
        //console.log(scrollAmount, diffMonths);
    this.listView.scrollToOffset({offset: scrollAmount, animated: false});
  }

  componentWillReceiveProps(props) {
    const current = parseDate(this.props.type, this.props.current);
    const nextCurrent = parseDate(this.props.type, props.current);
    if (nextCurrent && current && nextCurrent.getTime() !== current.getTime()) {
      this.scrollToMonth(nextCurrent);
    }

    const rowclone = this.state.rows;
    const newrows = [];
    for (let i = 0; i < rowclone.length; i++) {
      let val = this.state.texts[i];
      if (rowclone[i].getTime) {
        val = rowclone[i].clone();
        val.propbump = rowclone[i].propbump ? rowclone[i].propbump + 1 : 1;
      }
      newrows.push(val);
    }
    this.setState({
      rows: newrows
    });
  }

  onViewableItemsChanged({viewableItems}) {
    function rowIsCloseToViewable(index, distance) {
      for (let i = 0; i < viewableItems.length; i++) {
        if (Math.abs(index - parseInt(viewableItems[i].index)) <= distance) {
          return true;
        }
      }
      return false;
    }

    const rowclone = this.state.rows;
    const newrows = [];
    const visibleMonths = [];
    for (let i = 0; i < rowclone.length; i++) {
      let val = rowclone[i];
      const rowShouldBeRendered = rowIsCloseToViewable(i, 1);
      if (rowShouldBeRendered && !rowclone[i].getTime) {
        val = dateutils.addMonths(this.props.type, this.state.openDate, i - this.props.pastScrollRange);
      } else if (!rowShouldBeRendered) {
        val = this.state.texts[i];
      }
      newrows.push(val);
      if (rowIsCloseToViewable(i, 0)) {
        visibleMonths.push(xdateToData(this.props.type, val));
      }
    }
    if (this.props.onVisibleMonthsChange) {
      this.props.onVisibleMonthsChange(visibleMonths);
    }
    this.setState({
      rows: newrows
    });
  }

  renderCalendar({item}) {
    return (<CalendarListItem item={item} calendarHeight={this.props.calendarHeight}
                                  calendarWidth={this.props.horizontal ? this.props.calendarWidth : undefined} {...this.props} />);
  }

  getItemLayout(data, index) {
    return {
      length: this.props.horizontal ? this.props.calendarWidth : this.props.calendarHeight,
      offset: (this.props.horizontal ? this.props.calendarWidth : this.props.calendarHeight) * index,
      index
    };
  }

  getMonthIndex(month) {
    return dateutils.diffMonths(this.props.type, this.state.openDate, month) + this.props.pastScrollRange;
  }

  render() {
    return (
            <FlatList
                onLayout={this.onLayout}
                ref={(c) => this.listView = c}
                //scrollEventThrottle={1000}
                style={[this.style.container, this.props.style]}
                initialListSize={this.pastScrollRange + this.futureScrollRange + 1}
                data={this.state.rows}
                //snapToAlignment='start'
                //snapToInterval={this.calendarHeight}
                removeClippedSubviews={this.props.removeClippedSubviews}
                pageSize={1}
                horizontal={this.props.horizontal}
                pagingEnabled={this.props.pagingEnabled}
                onViewableItemsChanged={this.onViewableItemsChangedBound}
                renderItem={this.renderCalendarBound}
                showsVerticalScrollIndicator={this.props.showScrollIndicator}
                showsHorizontalScrollIndicator={this.props.showScrollIndicator}
                scrollEnabled={this.props.scrollingEnabled}
                keyExtractor={(item, index) => String(index)}
                initialScrollIndex={this.state.openDate ? this.getMonthIndex(this.state.openDate) : false}
                getItemLayout={this.getItemLayout}
                scrollsToTop={this.props.scrollsToTop}
            />
    );
  }
}

export default CalendarList;
