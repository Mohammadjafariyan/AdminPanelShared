import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {BPLogClient} from "../../BPLog/ServiceAndModels";
import {APFilter} from "../tgmodels";
import {ITableGeneratorFilter, ITableGeneratorPaging} from "../table-generator/table-generator.component";
import {LazyLoadEvent} from "primeng/primeng";

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.css']

})
export class DynamicTableComponent implements ITableGeneratorFilter, ITableGeneratorPaging {
  filters: APFilter[];
  tableColuns;
  filterHelper: Function;
  filterPagingHelper: Function;

  constructor() {
    this.filterHelper = this.filter.bind(this);
    this.filterPagingHelper = this.filterPaging.bind(this);
  }


  filter(form: FormGroup, first: number, rows: number, event: LazyLoadEvent) {
    throw new Error('not implemented');
  }

  filterPaging(first: number, rows: number, event: LazyLoadEvent) {
    throw new Error('not implemented');
  }

}


