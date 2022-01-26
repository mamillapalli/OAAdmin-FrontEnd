import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { InvoiceComponent } from '../invoice.component';

export const CONDITIONS_LIST = [
  {value: "nono", label: "Nono"},
  {value: "is-empty", label: "Is empty"},
  {value: "is-not-empty", label: "Is not empty"},
  {value: "is-equal", label: "Is equal"},
  {value: "is-not-equal", label: "Is not equal"},
];

export const CONDITIONS_FUNCTIONS = {
  // search method base on conditions list value
  "is-empty": function (value: string, filterdValue: any) {
    return value === "";
  },
  "is-not-empty": function (value: string, filterdValue: any) {
    return value !== "";
  },
  "is-equal": function (value: any, filterdValue: any) {
    return value == filterdValue;
  },
  "is-not-equal": function (value: any, filterdValue: any) {
    return value != filterdValue;
  },
};


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {

  public conditionsList = CONDITIONS_LIST;
  public searchValue: any = {};
  public searchLabel: any = {};
  public searchCondition: any = {};
  private _filterMethods = CONDITIONS_FUNCTIONS;
  searchFilter: any = {};
  @Input() labelId: any
  @ViewChild(InvoiceComponent) InvoiceComponent: InvoiceComponent

  constructor() { }

  ngOnInit(): void {
  }

  clearColumn($event: any, field: string) {

  }

  applyFilter($event: any, sbrReferenceId: string) {
    InvoiceComponent.applyFilter($event, sbrReferenceId);
  }
}
