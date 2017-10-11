import {Component, Input, OnInit} from '@angular/core';
import {APButton, APFilter} from "../tgmodels";
import {service} from "../../../service/service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {LazyLoadEvent, SelectItem} from "primeng/primeng";
import {BaseComponent} from "../../../base-component";
import {DateService} from "../datepicker/datepicker.component";

export class TableGService<T extends APFilter> extends service<T> {

}

@Component({
  selector: 'app-table-generator',
  templateUrl: './table-generator.component.html',
  styleUrls: ['./table-generator.component.css']
})
export class TableGeneratorComponent extends BaseComponent<APFilter,
  TableGService<APFilter>> implements OnInit {

  @Input('models')
  models: any;

  @Input('ITableGeneratorFilter')
  ITableGeneratorFilter: any;


  @Input('ITableGeneratorPaging')
  ITableGeneratorPaging: any;

  @Input('hasfilter')
  hasfilter;

  @Input('isLazy')
  isLazy;

  @Input('tableName')
  tableName;

  filters: APFilter[];
  @Input('total')
  total: number;

  @Input('buttons')
  buttons: APButton[];

  tableColuns: any;
  stacked = false;
  emptymsg = "هیچ رکوردی یافت نشد";
  dateFromGaregorian;
  dateToGaregorian;
  rows;
  heroForm: FormGroup;
  columnOptions: SelectItem[];
  style1: any = {'width': '100px'};
  DateService: DateService = new DateService();
  prev;
  formErrors = {};
  validationMessages = {};


  @Input('hasSearch')
  hasSearch;


  constructor(protected  fb: FormBuilder) {
    super();
  }

  @Input('filters')
  set _filters(val) {
    this.filters = val;
    console.log('0 push', val);
    const groups: any = {};
    // let search: APFilter = new APFilter();
    // search.name = "SearchTerm";
    // search.type = 100;
    //
    // console.log('first push');
    // this.filters.push({
    //   name: 'SearchTerm', title: null, type: 6
    //   , onchange: null, value: null, requred: true, pattern: null, hasOnchnage: false,
    //   obtions: null, optionPName: null, optionPValue: null
    // });
    if (this.filters)

      if (this.hasSearch && !this.isLazy) {

        this.filters.push({
          name: 'globalFilter', title: 'جستجو', type: 1
          , onchange: null, value: '', requred: false, pattern: '', hasOnchnage: false,
          obtions: null, optionPName: null, optionPValue: null, id: 10000 , max:100000,min:0
        });
      }


    this.filters.forEach((el, arr, i) => {
      // this.tableColuns.push({field: el.name, header: el.name});

      groups[el.name] = el.requred ? new FormControl(el.value || '', Validators.required) :
        new FormControl(el.value || '');

      this.formErrors[el.name] = '';
      this.validationMessages[el.name] = new Array();
      this.validationMessages[el.name]['required'] = `این مقدار ضروری است`;
      this.validationMessages[el.name]['pattern'] = `${el.pattern}مقادر وارد شده درست نیست  : `;
    });
    console.log('2 heroForm is :', groups);
    // this.heroForm = new FormGroup(groups);
    this.heroForm = this.fb.group(groups);

    this.buildForm();


  }

  @Input('tableColuns')
  set _tableColuns(val) {
    this.tableColuns = val;
    this.initColumns();
  }

  buttonClick(id, row) {
    console.log('buttonClick id ', id);
    const button = this.buttons.find(i => i.id == id);
    button.onclick(this.heroForm, row);
  }

  toggle() {
    this.stacked = !this.stacked;
    if (!this.stacked) {
      this.style1 = {'width': '100px'};
    } else {
      this.style1 = null;
    }
  }

  ngOnInit() {

  }

  loadCarsLazy(event: LazyLoadEvent) {
    this.LoadLazyHelper(event.first, event.rows, event, this.heroForm.value.globalFilter);
  }

  filterSearch() {
    this.ITableGeneratorFilter.filter(this.heroForm, 0, 20, event, this.heroForm.value.globalFilter);
  }

  initColumns() {

    this.columnOptions = [];
    for (let i = 0; i < this.tableColuns.length; i++) {
      this.columnOptions.push({label: this.tableColuns[i].header, value: this.tableColuns[i]});
    }
  }

  set_dateFrom(s, name) {
    if (s) {
      this.dateFromGaregorian = this.DateService.getToGaregorianStr(s).toString();
    } else {
      this.dateFromGaregorian = null;
    }

    const arr = new Array();
    arr[name] = this.dateFromGaregorian;
    this.heroForm.patchValue(arr);

  }

  set_dateTo(s, name) {
    if (s) {
      this.dateToGaregorian = this.DateService.getToGaregorianStr(s).toString();
    } else {
      this.dateToGaregorian = null;
    }
    const arr = new Array();
    arr[name] = this.dateToGaregorian;
    this.heroForm.patchValue(arr);
  }

  filterChange(name, event) {

    const findedFilter = this.filters.find(f => f.name == name);

    if (findedFilter.hasOnchnage) {
      console.log('this.heroForm.value[name] ', this.heroForm.value[name]);
      findedFilter.onchange(event, this.heroForm.value[name], this.heroForm.value);
    }
  }

  buildForm(): void {

    this.heroForm.valueChanges
      .subscribe(data => {
        this.onValueChanged(data);
        console.log('value changed', data);
      });

  }

  onValueChanged(data ?: any) {
    if (!this.heroForm) {
      return;
    }
    const form = this.heroForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  private LoadLazyHelper(first, rows, event, searchTerm) {
    console.log('LoadLazyHelper', event);
    this.rows = rows;
    first = first ? first : 0;
    rows = rows ? rows : 20;


    this.ITableGeneratorPaging.filterPaging(first, rows, event, searchTerm, this.heroForm);
  }


}

export class TableGeneratorService<T>  extends service<T> {
}


export interface ITableGeneratorFilter {
  filter(form: FormGroup, first: number, rows: number, event: LazyLoadEvent, searchTerm);
}

export interface ITableGeneratorPaging {
  filterPaging(first: number, rows: number, event: LazyLoadEvent, searchTerm, form);
}


