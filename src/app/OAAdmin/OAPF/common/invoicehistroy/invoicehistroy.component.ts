import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../Model/OAAdmin/Request/corporateUser";
import {Subscription} from "rxjs";
import {invoiceService} from "../../../shared/OAPF/invoice.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { CustomColumn } from 'src/app/OAAdmin/Model/CustomColumn';
import { CONDITIONS_LIST } from 'src/app/OAAdmin/shared/condition_list';
import { CONDITIONS_FUNCTIONS } from 'src/app/OAAdmin/shared/condition_function';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-invoicehistroy',
  templateUrl: './invoicehistroy.component.html',
  styleUrls: ['./invoicehistroy.component.scss']
})
export class InvoicehistroyComponent implements OnInit {
    dataSource: any = new MatTableDataSource<corporateUser>();
  private subscriptions: Subscription[] = [];
  @Output('invoiceNumber') invoiceNumber: any;
  displayedColumns: string[] = ['invoiceNumber', 'sbrReferenceId', 'currency',
    'amount', 'dueDate', 'status', 'eventName','eventUser','eventDate'];

  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData : any

  //inside filter
  public columnShowHideList: CustomColumn[] = [];
  color = 'accent';
  public conditionsList = CONDITIONS_LIST;
  public searchValue: any = {};
  public searchLabel: any = {};
  public searchCondition: any = {};
  private _filterMethods = CONDITIONS_FUNCTIONS;
  searchFilter: any = {};
  columns: { columnDef: string; header: string; }[];


  constructor(public invoiceServices: invoiceService, public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.initializeColumnProperties();
    this.columns = [
      { columnDef: 'invoiceNumber', header: 'Invoice Number' },
      { columnDef: 'sbrReferenceId', header: 'SBR No' },
      { columnDef: 'currency', header: 'Currency' },
      { columnDef: 'amount', header: 'Amount' },
      { columnDef: 'dueDate', header: 'Due Date' },
      { columnDef: 'status', header: 'status' },
      { columnDef: 'eventName', header: 'Event Name' },
      { columnDef: 'eventUser', header: 'Event User' },
      { columnDef: 'eventDate', header: 'Event Date' },
    ]
    this.getInvoices();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  public getInvoices() {
    const sb = this.invoiceServices.getInvoice('', this.invoiceNumber, 'viewHistory').subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
    this.subscriptions.push(sb);
  }

  closeModal(cancel: string) {
    this.activeModal.dismiss(cancel);
  }

  pageChanged(event: any) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getInvoices();
  }

  sortChanges(event: Sort) {
    this.sortData = event.active+','+event.direction
    this.getInvoices();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  initializeColumnProperties() {
    this.displayedColumns.forEach((element, index) => {
      this.columnShowHideList.push(
        {
          possition: index, name: element, isActive: true
        }
      );
    });
  }

  toggleColumn(column: any) {
    if (column.isActive && column.name !== 'columnSetting') {
      if (column.possition > this.displayedColumns.length - 1) {
        this.displayedColumns.push(column.name);
      } else {
        this.displayedColumns.splice(column.possition, 0, column.name);
      }
    } else {
      let i = this.displayedColumns.indexOf(column.name);
      let opr = i > -1 ? this.displayedColumns.splice(i, 1) : undefined;
    }
  }

}
