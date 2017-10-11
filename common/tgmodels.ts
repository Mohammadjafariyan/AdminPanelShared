import {FormGroup} from "@angular/forms";

export class APFilter implements filterOnchange {
  name: string;
  title: string;
  type: number;//from to 0 , input 1 , dropdown 2,true false 3 , 4 number
  value;
  requred: boolean;
  pattern: string;
  obtions: any[];
  optionPName: string;
  optionPValue: string;
  id;
  max: number;
  min: number;
  hasOnchnage: boolean;

  onchange(event: any, value: any, form: FormGroup) {

  }
}

export interface filterOnchange {
  onchange(event: any, value: any, form: FormGroup);

}

export class APFilterHelper {
  models: APFilter[];

  constructor() {
    this.models = new Array();
  }


  addToFilters(name: string, title: string, type: number, required: boolean, id,
               options?: any[], onchange?: any, hasonchage?: boolean, value?, pattern?: string,
               optionpname?: string, optionpvalue?: string, max?: number, min?: number) {
    this.models.push({
      name: name, title: title, type: type
      , onchange: onchange, value: value, requred: required, pattern: pattern, hasOnchnage: hasonchage,
      obtions: options, optionPName: optionpname, optionPValue: optionpvalue, id: id, max: max, min: min
    });
  }
}


export class APButton {
  name: string;
  onclick;
  icon;
  place: number;//1 table 2 top
  style: string;
  class: string;
  classFunc;
  NameFunc;
  id: number;
}

