import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {financingService} from "../../shared/OAPF/financing.service";
import {Subscription} from "rxjs";
import {financing, inits} from "../../Model/OAPF/Request/financing";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {FinancingmodalComponent} from "./financingmodal/financingmodal.component";
import {NgxSpinnerService} from "ngx-spinner";
import {oapfcommonService} from "../../shared/oapfcommon.service";
import {AuthService} from "../../../modules/auth";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import {FilterComponent} from "../common/filter/filter.component";
import { CustomColumn } from '../../Model/CustomColumn';
import {CONDITIONS_FUNCTIONS, CONDITIONS_LIST } from '../invoice/invoice.component';

@Component({
  selector: 'app-financing',
  templateUrl: './financing.component.html',
  styleUrls: ['./financing.component.scss']
})
export class FinancingComponent implements OnInit {
  isLoading: any;
  dataSource: any = new MatTableDataSource<financing>();
  @Output() displayedColumns: string[] = ['columnSetting','financeId', 'sbrReferenceId', 'agreementId', 'financeCurrency', 'financeAmount', 'financeDueDate', 'businessType','transactionStatus','actions'];
  @Output() fDisplayedColumns: string[] = ['financeId', 'sbrReferenceId', 'agreementId', 'financeCurrency', 'financeAmount', 'financeDueDate', 'businessType','transactionStatus'];

  subscriptions: Subscription[] = [];
  financing: financing;
  modalOption: NgbModalOptions = {};
  closeResult: string;
  authRoles: any

  //sort
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

  constructor(public financingService: financingService,
              public modalService: NgbModal,
              private spinner: NgxSpinnerService,
              public oapfcommonService: oapfcommonService,
              public authService: AuthService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles
  }

  ngOnInit(): void {
    this.initializeColumnProperties();
    this.columns = [
      { columnDef: 'financeId', header: 'User Id' },
      { columnDef: 'sbrReferenceId', header: 'SBR Id' },
      { columnDef: 'agreementId', header: 'Agreement Id' },
      { columnDef: 'financeCurrency', header: 'Currency' },
      { columnDef: 'financeAmount', header: 'Amount' },
      { columnDef: 'financeDueDate', header: 'Due Date' },
      { columnDef: 'businessType', header: 'Business Type' },
      { columnDef: 'transactionStatus', header: 'Trx Status' },
    ]
    this.getFinancing();
  }

  public getFinancing() {
    console.log('Get Invoices')
    this.spinner.show();
    const sb = this.oapfcommonService.getDataWithPagination('/oapf/api/v1/finances/', this.currentPage, this.pageSize,this.sortData).subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
  }

  newFinance() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(FinancingmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      console.log('newBankAdmin is ' + result);
    }, (reason) => {
      this.getFinancing();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openFinanceDialog(element: any, mode: string) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(FinancingmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getFinancing();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openInvoiceDelete(content: any, element: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element);
      }
    }, (reason) => {
      this.getFinancing();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(data: any) {
    this.financingService.dataItem(data, 'delete').subscribe(res => {
    }, (error: { message: any }) => {
      console.error('There was an error!', error);
      return;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  pageChanged(event: any) {
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getFinancing();
  }

  sortChanges(event: Sort) {
    this.sortData = event.active+','+event.direction
    this.getFinancing();
  }

  openFilter() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(FilterComponent, this.modalOption);
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      if (result.valid && result.value.filterOption.length > 0) {
        const sb = this.oapfcommonService.getFilterWithPagination(result, 'filter', 'oapf/api/v1/finance',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oapfcommonService.getFilterWithPagination(result, 'all', 'oapf/api/v1/finance',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  public applyFilter(event: any,label:any) {
    console.log('apply filter')
    this.searchFilter = {
      values: this.searchValue,
      conditions: this.searchCondition,
      methods: this._filterMethods,
      label: label,
    };
    if(this.searchFilter.values !== null) {
      let htp = {
        filterId : this.searchFilter.label,
        filterValue : this.searchFilter.values.field
      }
      const sb = this.oapfcommonService.getFilterWithPagination(htp, 'filterByData', '/oapf/api/v1/finances/', this.currentPage, this.pageSize, this.sortData).subscribe((res: any) => {
        this.dataSource.data = res.content;
        this.totalRows = res.totalElements
      });
      this.subscriptions.push(sb);
    }
  }

  clearColumn(event:any,columnKey: string): void {
    console.log(columnKey)
    this.searchValue[columnKey] = null;
    this.searchCondition[columnKey] = "none";
    this.applyFilter(null,null);
    this.getFinancing()
  }


}
