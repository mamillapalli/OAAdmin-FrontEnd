import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../modules/auth";
import {NotificationService} from 'src/app/OAAdmin/shared/notification.service';
import {DatePipe} from "@angular/common";
import {catchError, retry} from "rxjs/operators";
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription, throwError} from "rxjs";
import {InterestRate} from 'src/app/ReqModal/interestrate';
import {InterestRateModalComponent} from './interest-rate-modal/interest-rate-modal.component';
import {oaCommonService} from "../../../OAAdmin/shared/oacommon.service";
import {CustomColumn} from 'src/app/OAAdmin/Model/CustomColumn';
import {CONDITIONS_LIST} from 'src/app/OAAdmin/shared/condition_list';
import {CONDITIONS_FUNCTIONS} from 'src/app/OAAdmin/shared/condition_function';
import {MatMenuTrigger} from '@angular/material/menu';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { FilterComponent } from 'src/app/OAAdmin/OAPF/common/filter/filter.component';

@Component({
  selector: 'app-interest-rate',
  templateUrl: './interest-rate.component.html',
  styleUrls: ['./interest-rate.component.scss']
})
export class InterestRateComponent implements OnInit {


  dataSource: any = new MatTableDataSource<InterestRate>();
  displayedColumns: string[] = ['columnSetting', 'name', 'rateValue', 'description', 'transactionStatus', 'actions'];
  fDisplayedColumns: string[] = ['name', 'rateValue', 'description', 'transactionStatus'];
  authToken: any;
  modalOption: NgbModalOptions = {}; // not null!
  closeResult: string;
  colorCode: string;
  isLoading: any;
  IntRateForm: FormGroup
  public time: string | null;

  authRoles: any
  //SORTING
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData: any

  public columnShowHideList: CustomColumn[] = [];
  color = 'accent';

  //inside filter
  public conditionsList = CONDITIONS_LIST;
  public searchValue: any = {};
  public searchLabel: any = {};
  public searchCondition: any = {};
  private _filterMethods = CONDITIONS_FUNCTIONS;
  searchFilter: any = {};
  columns: { columnDef: string; header: string; }[];
  @ViewChild('MatMenuTrigger') matMenuTrigger: MatMenuTrigger;
  @ViewChild('menuTrigger') trigger: any;

  private subscriptions: Subscription[] = [];

  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService: NotificationService,
              private datePipe: DatePipe, public oaCommonService: oaCommonService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles
  }

  ngOnInit(): void {
    this.initializeColumnProperties();
    this.columns = [
      { columnDef: 'name', header: 'Rate Name' },
      { columnDef: 'rateValue', header: 'Business Unit' },
      { columnDef: 'description', header: 'Description' },
      { columnDef: 'transactionStatus', header:'transactionStatus' }
    ]
    this.time = this.datePipe.transform(new Date());
    this.getIntRate();
  }

  public getIntRate() {
    const sb = this.oaCommonService.getMethodWithPagination('/oadata/api/v1/interestRates/', '', this.currentPage, this.pageSize, this.sortData).subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
    this.subscriptions.push(sb);
  }

  newIntRate() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(InterestRateModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      console.log('New IntRate is ' + result);
      this.getIntRate();
    }, (reason) => {
      this.getIntRate();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openIntRateDialog(element: any, mode: any) {
    console.log('Anil', element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    //this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(InterestRateModalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      console.log('result===', result);
      this.getIntRate();
    }, (reason) => {
      this.getIntRate();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openIntRateDelete(content: any, element: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element.isoCode);
      }
    }, (reason) => {
      this.getIntRate();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(isoCode: any) {
    this.deleteIntRate(isoCode).subscribe(res => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error, 'Delete Customer')
      console.error('There was an error!', error);
      return;
    });
  }

  deleteIntRate(isoCode: any) {
    console.log(isoCode)
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>('oadata/api/v1/interestRates/' + isoCode, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
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

  errorHandle(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

  getColor(post: any) {
    {
      if (post.deleteFlag) {
        this.colorCode = '#cc0248'
      } else if (post.transactionStatus === 'MASTER') {
        this.colorCode = '#151414'
      } else {

        this.colorCode = '#5db6e3'
      }
      return this.colorCode;
    }
  }


  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function (data: { firstName: string; }, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data.firstName.toLowerCase().indexOf(searchTerms.firstName) !== -1
    }
    return filterFunction;
  }

  openFilter() {
    console.log('open filter')
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(FilterComponent, this.modalOption);
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      if (result.valid && result.value.filterOption.length > 0) {
        const sb = this.oaCommonService.getFilterWithPagination(result, 'filter', '/oadata/api/v1/interestRates/', this.currentPage, this.pageSize, this.sortData).subscribe((res: any) => {
          this.dataSource.data = res;
          this.totalRows = res.length
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oaCommonService.getFilterWithPagination(result, 'all', '/oadata/api/v1/interestRates/', this.currentPage, this.pageSize, this.sortData).subscribe((res: any) => {
          this.dataSource.data = res;
          this.totalRows = res.length
        });
        this.subscriptions.push(sb);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  pageChanged(event: any) {
    console.log(this.sort)
    console.log({event});
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getIntRate();
  }

  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active + ',' + event.direction
    this.getIntRate();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  public applyFilter(event: any, label: any) {
    console.log('apply filter')
    this.trigger.closeMenu()
    this.matMenuTrigger.closeMenu()
    this.searchFilter = {
      values: this.searchValue,
      conditions: this.searchCondition,
      methods: this._filterMethods,
      label: label,
    };
    if (this.searchFilter.values !== null) {
      let htp = {
        filterId: this.searchFilter.label,
        filterValue: this.searchFilter.values.field
      }
      const sb = this.oaCommonService.getFilterWithPagination(htp, 'filterByData', '/oadata/api/v1/interestRates/', this.currentPage, this.pageSize, this.sortData).subscribe((res: any) => {
        this.dataSource.data = res.content;
        this.totalRows = res.totalElements
      });
      this.subscriptions.push(sb);
    }
    //this.dataSource.filter = searchFilter;
  }

  clearColumn(event: any, columnKey: string): void {
    console.log(columnKey)
    this.searchValue[columnKey] = null;
    this.searchCondition[columnKey] = "none";
    this.applyFilter(null, null);
    this.getIntRate()
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
