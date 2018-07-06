import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {xdateToData} from '../../interface';
import dateutils from '../../dateutils';
import styleConstructor from './style';
const Moment = require('moment');
const jMoment = require('moment-jalaali');

class ReservationListItem extends Component {
  constructor(props) {
    super(props);
    this.styles = styleConstructor(props.theme);
  }

  shouldComponentUpdate(nextProps) {
    const r1 = this.props.item;
    const r2 = nextProps.item;
    let changed = true;
    if (!r1 && !r2) {
      changed = false;
    } else if (r1 && r2) {
      if (r1.day.getTime() !== r2.day.getTime()) {
        changed = true;
      } else if (!r1.reservation && !r2.reservation) {
        changed = false;
      } else if (r1.reservation && r2.reservation) {
        if ((!r1.date && !r2.date) || (r1.date && r2.date)) {
          changed = this.props.rowHasChanged(r1.reservation, r2.reservation);
        }
      }
    }
    return changed;
  }

  renderDate(date, item) {
    if (this.props.renderDay) {
      return this.props.renderDay(date ? xdateToData(this.props.type, date) : undefined, item);
    }
    let todayDate;
    if(this.props.type === 'jalaali') {
      todayDate = jMoment.utc();
    }
    else {
      todayDate = Moment.utc();
    }
    const today = dateutils.sameDate(this.props.type, date, todayDate) ? this.styles.today : undefined;
    if (date) {
      return (
        <View style={this.styles.day}>
          <Text allowFontScaling={false} style={[this.styles.dayNum, today]}>{date.getDate()}</Text>
          <Text allowFontScaling={false} style={[this.styles.dayText, today]}>{dateutils.weekDayNames(this.props.type)[date.day()]}</Text>
        </View>
      );
    } else {
      return (
        <View style={this.styles.day}/>
      );
    }
  }

  render() {
    const {reservation, date} = this.props.item;
    let content;
    if (reservation) {
      const firstItem = date ? true : false;
      content = this.props.renderItem(reservation, firstItem);
    } else {
      content = this.props.renderEmptyDate(date);
    }
    return (
      <View style={this.styles.container}>
        {this.renderDate(date, reservation)}
        <View style={{flex:1}}>
          {content}
        </View>
      </View>
    );
  }
}

export default ReservationListItem;
