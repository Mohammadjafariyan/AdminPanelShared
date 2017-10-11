import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {APFilter} from "../tgmodels";
import {DateService} from "../datepicker/datepicker.component";
import {TableGeneratorComponent} from "../table-generator/table-generator.component";

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.css'],
  providers: [FormBuilder]
})
export class DynamicFormComponent extends TableGeneratorComponent implements OnInit {


  @Input('DynamicFormHandler')
  DynamicFormHandler: IDynamicFormHandler;

  constructor(protected  fb: FormBuilder) {
    super(fb);
  }


  submit() {
    this.DynamicFormHandler.SubmitEvent(this.heroForm);
  }

  ngOnInit() {

  }


}


export interface IDynamicFormHandler {
  SubmitEvent(form: FormGroup);
}


