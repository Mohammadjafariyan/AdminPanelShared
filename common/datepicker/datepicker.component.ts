import {AfterViewInit, Component, EventEmitter, Injectable, Input, OnInit, Output} from '@angular/core';
import {ChangeDetectorRef} from '@angular/core';
import {ChangeDetectionStrategy} from '@angular/core';
import {FormControl, FormGroup, Validator, Validators} from '@angular/forms';
import {forEach} from '@angular/router/src/utils/collection';
import {SelectItem} from 'primeng/components/common/api';
import * as $ from 'jquery';
import {BaseComponent} from "../../../base-component";

export class shamsDate {
  public MonthName: string;
  public year: number;
  public day: number;
  public month: number;

  toStringB(date: shamsDate) {
    return `${date.year}-${date.month}-${date.day}`;
  }

  toString() {
    return `${this.year}-${this.month}-${this.day}`;
  }

}

export class month {
  public beginMonthName: string;
  public begin: number;
  public beginMonthQamar: number;
  public end: number;
  public endMonthQamar: number;
  public number: number;
  public endMonthName: string;
  public engname: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  moduleId: 'lsf',
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css'],
})
export class DatepickerComponent implements OnInit, AfterViewInit {

  @Input('name')
  name: string;

  @Input('title')
  title;

  selected;

  show = false;
  @Output('selectedEvent')
  selectedEvent = new EventEmitter<any>();
  year: number;
  day: number;
  month: number;
  maxDay;
  months: SelectItem[];
  DateService: DateService;
  today_day;
  today_month;
  today_year;
  displayEls;
  id;

  regex = new RegExp(/'[0-9]{4}\/[0-9]{2}\/[0-9]{2}'/);

  constructor() {
    this.DateService = new DateService();
    this.id = Math.random();
  }

  get _selected() {
    return this.selected;
  }

  @Input('selected')
  set _selected(val) {


    this.selected = val;
    if (!val) {
      console.log('set _selected:emited');
      this.selectedEvent.emit(null);
    }

  }

  onComplete() {

    if (this.regex.test(this.selected)) {
      BaseComponent.showMessageOut('تاریخ اشتباه است', 'warning');
      return;
    }
    console.log('onComplete:emmited');
    this.selectedEvent.emit(this.selected);
  }

  showMe() {
    this.show = !this.show;
  }

  goToday() {
    //    let date = this.DateService.getTodayFromIndex();

    this.day = this.today_day;
    this.month = this.today_month;
    this.year = this.today_year;
  }

  ngAfterViewInit() {
    this.DateService.buildMonths();
    let date = this.DateService.getTodayFromIndex();
    // this.DateService.getToGaregorian(new Date());
    this.months = [
      {label: 'فروردین', value: '1'},
      {label: 'اوردیبهشت', value: '2'},
      {label: 'خرداد', value: '3'},
      {label: 'تیر', value: '4'},
      {label: 'مرداد', value: '5'},
      {label: 'شهریور', value: '6'},
      {label: 'مهر', value: '7'},
      {label: 'آبان', value: '8'},
      {label: 'آذر', value: '9'},
      {label: 'دی', value: '10'},
      {label: 'بهمن', value: '11'},
      {label: 'اسفند', value: '12'},
    ]
    //  let dateshams = this.DateService.getToday();
    this.displayEls = true;

    this.day = date.day;
    this.month = date.month;
    this.year = date.year;

    this.today_day = date.day;
    this.today_month = date.month;
    this.today_year = date.year;


    // console.log(this.DateService.convertDate(this.year, this.month, this.day));
  }

  showEls() {
  }

  ngOnInit() {
    // this.buildForm();
  }

  monthChange() {
    if (this.month > 6)
      this.maxDay = 30;
    if (this.month <= 6)
      this.maxDay = 32;
    if (this.month == 12)
      this.maxDay = 29;
  }

  select() {
    let monthStr = '' + this.month;
    let dayStr = '' + this.day;
    if (this.month < 10) {
      monthStr = '0' + this.month;
    }
    if (this.day < 10) {
      dayStr = '0' + this.day;
    }
    this._selected = '' + this.year + '/' + monthStr + '/' + dayStr;
    console.log('emited', this.selected);
    this.selectedEvent.emit(this.selected);
  }


}

@Injectable()
export class DateService {

  monthsData: month[];

  getTodayFromIndex() {
    document.getElementById('ShamsDate').setAttribute('method', 'getToday');
    document.getElementById('ShamsDate').click();
    var answer = document.getElementById('ShamsDate').getAttribute('answer');


    var splited = answer.split('/');
    //console.log('splited is ', splited);
    var year = parseInt(splited[2]);
    var day = parseInt(splited[0]);
    var month = parseInt(splited[1]);

    var tmp = new shamsDate();
    tmp.year = year;
    tmp.day = day;
    tmp.month = month;
    console.log(tmp);
    return tmp;
  }

  getToGaregorianStr(date: string): shamsDate {
    var splited = date.split('/');
    console.log('begin splited is ', splited);

    var year = parseInt(splited[0]);
    var day = parseInt(splited[2]);
    var month = parseInt(splited[1]);

    var shamsDate = this.getToGaregorian(year, month, day);
    return shamsDate; //new Date(shamsDate.year, shamsDate.month, shamsDate.day);
  }

  getToday(): shamsDate {
    let date = new Date();
    let splited = date.toLocaleDateString().split('/');
    let year = parseInt(splited[2]);
    let day = parseInt(splited[1]);
    let month = parseInt(splited[0]);
    let dateshams = this.convertDate(year, month, day);

    return dateshams;
  }

  convertDate(year, month, day): shamsDate {
    let m = this.monthsData.find((m) => m.number == month);
    if (m.number == month) {
      let monthLength = 31;
      if (m.number > 6)
        monthLength = 30;
      if (m.number == 12)
        monthLength = 29;

      let temp = m.begin + day;
      let shamsd = new shamsDate();
      shamsd.year = this.getShamsYear(year, month, day);

      if (temp > monthLength) {
        shamsd.month = m.beginMonthQamar;
        shamsd.day = temp - monthLength
        return shamsd;
      } else {
        shamsd.month = m.endMonthQamar;
        shamsd.day = temp
        return shamsd;
      }
    }
  }

  convertToGaregorian(year, month, day): shamsDate {
    let m = this.monthsData.find((m) => m.number == month);
    if (m.number == month) {
      let monthLength = 31;
      if (m.number > 6)
        monthLength = 30;
      if (m.number == 12)
        monthLength = 29;

      let temp = m.begin + day;
      let shamsd = new shamsDate();
      shamsd.year = this.getGaregorianYear(year, month, day);

      if (temp > monthLength) {
        shamsd.month = m.beginMonthQamar;
        shamsd.day = temp - monthLength
        return shamsd;
      } else {
        shamsd.month = m.endMonthQamar;
        shamsd.day = temp
        return shamsd;
      }
    }
  }

  getGaregorianYear(year, month, day) {
    let spectDate = 621;
    if (month >= 1 && month <= 3) {
      if (month <= 3 && day > 21) {
      } else {
        spectDate = 622;
      }
    }
    return year + spectDate;
  }

  getShamsYear(year, month, day) {
    let spectDate = 621;
    if (month >= 1 && month <= 3) {
      if (month <= 3 && day > 21) {
      } else {
        spectDate = 622;
      }
    }
    return year - spectDate;
  }

  buildMonths() {
    this.monthsData = [
      {
        beginMonthQamar: 10,
        endMonthQamar: 11,
        number: 1,
        begin: 11,
        end: 11,
        engname: 'jan',
        beginMonthName: 'دی',
        endMonthName: 'بهمن'
      },
      {
        beginMonthQamar: 11,
        endMonthQamar: 12,
        number: 2,
        begin: 12,
        end: 9,
        engname: 'feb',
        beginMonthName: 'بهمن',
        endMonthName: 'اسفند'
      },
      {
        beginMonthQamar: 12,
        endMonthQamar: 1,
        number: 3,
        begin: 10,
        end: 11,
        engname: 'mars',
        beginMonthName: 'اسفند',
        endMonthName: 'فروردین'
      },
      {
        beginMonthQamar: 1,
        endMonthQamar: 2,
        number: 4,
        begin: 12,
        end: 10,
        engname: 'avril',
        beginMonthName: 'فروردین',
        endMonthName: 'اوردیبهشت'
      },
      {
        beginMonthQamar: 2,
        endMonthQamar: 3,
        number: 5,
        begin: 11,
        end: 10,
        engname: 'mey',
        beginMonthName: 'اوردیبهشت',
        endMonthName: 'خرداد'
      },
      {
        beginMonthQamar: 3,
        endMonthQamar: 4,
        number: 6,
        begin: 11,
        end: 9,
        engname: 'jun',
        beginMonthName: 'خرداد',
        endMonthName: 'تیر'
      },
      {
        beginMonthQamar: 4,
        endMonthQamar: 5,
        number: 7,
        begin: 10,
        end: 9,
        engname: 'jul',
        beginMonthName: 'تیر',
        endMonthName: 'مرداد'
      },
      {
        beginMonthQamar: 5,
        endMonthQamar: 6,
        number: 8,
        begin: 10,
        end: 9,
        engname: 'ot',
        beginMonthName: 'مرداد',
        endMonthName: 'شهریور'
      },
      {
        beginMonthQamar: 6,
        endMonthQamar: 7,
        number: 9,
        begin: 10,
        end: 8,
        engname: 'sept',
        beginMonthName: 'شهریور',
        endMonthName: 'مهر'
      },
      {
        beginMonthQamar: 7,
        endMonthQamar: 8,
        number: 10,
        begin: 9,
        end: 9,
        engname: 'oct',
        beginMonthName: 'مهر',
        endMonthName: 'آبان'
      },
      {
        beginMonthQamar: 8,
        endMonthQamar: 9,
        number: 11,
        begin: 10,
        end: 9,
        engname: 'nov',
        beginMonthName: 'آبان',
        endMonthName: 'آذر'
      },
      {
        beginMonthQamar: 9,
        endMonthQamar: 10,
        number: 12,
        begin: 10,
        end: 10,
        engname: 'sep',
        beginMonthName: 'آذر',
        endMonthName: 'دی'
      },
    ];
  }

  private getToGaregorian(tyear, tmonth, tday): shamsDate {

    document.getElementById('ShamsDate').setAttribute('year', tyear);
    document.getElementById('ShamsDate').setAttribute('day', tday);
    document.getElementById('ShamsDate').setAttribute('month', tmonth);

    document.getElementById('ShamsDate').setAttribute('method', 'toGaregorian');
    document.getElementById('ShamsDate').click();

    var year = document.getElementById('ShamsDate').getAttribute('year');
    var day = document.getElementById('ShamsDate').getAttribute('day');
    var month = document.getElementById('ShamsDate').getAttribute('month');


    //var answer = document.getElementById('ShamsDate').getAttribute('answer');


    //let date = new Date(answer);
    /*   var splited = answer.split('/');

       console.log('getToGaregorian is ',splited );

       var year = parseInt(splited[2]);
       var day = parseInt(splited[0]);
       var month = parseInt(splited[1]);
   */


    var tmp = new shamsDate();
    tmp.year = parseInt(year);
    tmp.day = parseInt(day);
    tmp.month = parseInt(month);
    console.log('getToGaregorian method shamsDate', tmp);

    return tmp;
  }


}
