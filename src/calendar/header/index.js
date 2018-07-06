import React, {Component} from 'react';
import {ActivityIndicator} from 'react-native';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import {weekDayNames, formatMonthYear} from '../../dateutils';

const Moment = require('moment');

class CalendarHeader extends Component {
  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(Moment),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    hideDayNames: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
    this.setDefaultMonthFormat = this.setDefaultMonthFormat.bind(this);
    this.setDefaultMonthFormat(props.monthFormat);
  }

  setDefaultMonthFormat(format) {
    let monthFormat;
    if (format) {
      monthFormat = format;
    }
    if (this.props.type === 'jalaali') {
      monthFormat = 'jMMMM jYYYY';
    }
    else {
      monthFormat = 'MMMM YYYY';
    }
    this.setState({monthFormat});
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    if (
            formatMonthYear(nextProps.type, nextProps.month) !== formatMonthYear(this.props.type, this.props.month)
        ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.hideDayNames !== this.props.hideDayNames) {
      return true;
    }
    if (nextProps.monthFormat !== this.props.monthFormat) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.monthFormat !== nextProps.monthFormat)
      this.setDefaultMonthFormat(nextProps.monthFormat);
  }

  onPressLeft() {
    const {onPressArrowLeft} = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth);
    }
    return this.substractMonth();
  }

  onPressRight() {
    const {onPressArrowRight} = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth);
    }
    return this.addMonth();
  }

  render() {
    let leftArrow = <View/>;
    let rightArrow = <View/>;
    let weekDaysNames = weekDayNames(this.props.type, this.props.firstDay);
    if (!this.props.hideArrows) {
      leftArrow = (
                <TouchableOpacity
                    onPress={this.onPressLeft}
                    style={this.style.arrow}
                    hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                >
                    {this.props.renderArrow
                        ? this.props.renderArrow('left')
                        : <Image
                            source={require('../img/previous.png')}
                            style={this.style.arrowImage}
                        />}
                </TouchableOpacity>
            );
      rightArrow = (
                <TouchableOpacity
                    onPress={this.onPressRight}
                    style={this.style.arrow}
                    hitSlop={{left: 20, right: 20, top: 20, bottom: 20}}
                >
                    {this.props.renderArrow
                        ? this.props.renderArrow('right')
                        : <Image
                            source={require('../img/next.png')}
                            style={this.style.arrowImage}
                        />}
                </TouchableOpacity>
            );
    }
    let indicator;
    if (this.props.showIndicator) {
      indicator = <ActivityIndicator/>;
    }
    return (
            <View>
                <View style={this.style.header}>
                    {leftArrow}
                    <View style={{flexDirection: 'row'}}>
                        <Text allowFontScaling={false} style={this.style.monthText} accessibilityTraits='header'>
                            {this.props.month.format(this.state.monthFormat)}
                        </Text>
                        {indicator}
                    </View>
                    {rightArrow}
                </View>
                {
                    !this.props.hideDayNames &&
                    <View style={this.style.week}>
                        {this.props.weekNumbers && <Text allowFontScaling={false} style={this.style.dayHeader}></Text>}
                        {weekDaysNames.map((day, idx) => (
                            <Text allowFontScaling={false} key={idx} accessible={false} style={this.style.dayHeader}
                                  numberOfLines={1} importantForAccessibility='no'>{day}</Text>
                        ))}
                    </View>
                }
            </View>
    );
  }
}

export default CalendarHeader;
