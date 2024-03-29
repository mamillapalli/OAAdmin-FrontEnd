import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { AuthService } from "../../../modules/auth";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort, Sort } from "@angular/material/sort";
import { Sbr } from "../../Model/sbr";
import { ModalDismissReasons, NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { catchError, retry } from "rxjs/operators";
import { Subscription, throwError } from "rxjs";
import { NotificationService } from "../../shared/notification.service";
import { CustomerService } from "../../shared/customer.service";
const API_USERS_URL = `${environment.apiUrl}`;
import { oapfcommonService } from '../../shared/oapfcommon.service';
import { FilterComponent } from '../../OAPF/common/filter/filter.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { CustomColumn } from '../../Model/CustomColumn';
import { CONDITIONS_LIST } from '../../shared/condition_list';
import { CONDITIONS_FUNCTIONS } from '../../shared/condition_function';
import { NewsbrmodalComponent } from './newsbrmodal/newsbrmodal.component';

@Component({
  selector: 'app-newsbr',
  templateUrl: './newsbr.component.html',
  styleUrls: ['./newsbr.component.scss']
})
export class NewsbrComponent implements OnInit {

  dataSource: any = new MatTableDataSource<Sbr>();
  displayedColumns: string[] = ['columnSetting','sbrId', 'anchorCustomerContactName', 'anchorPartyAccountId', 'recourseFlag', 'transactionStatus' , 'actions'];
  fDisplayedColumns: string[] = ['sbrId', 'anchorCustomerContactName', 'anchorPartyAccountId', 'recourseFlag', 'status']
  authToken: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  modalOption: NgbModalOptions = {}; // not null!
  closeResult: string;
  colorCode: string;
  isLoading: any;
  totalRows = 0;
  pageSize = 5;
  authRoles: any
  sortData: any
  currentPage = 0;
  private subscriptions: Subscription[] = [];
  pageSizeOptions: number[] = [5, 10, 25, 100];

  //filter &
  public columnShowHideList: CustomColumn[] = []
  color = 'accent';
  //inside filter
  public conditionsList = CONDITIONS_LIST;
  public searchValue: any = {};
  public searchLabel: any = {};
  public searchCondition: any = {};
  private _filterMethods = CONDITIONS_FUNCTIONS;
  searchFilter: any = {};
  columns: { columnDef: string; header: string; }[];


  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService: NotificationService,
              public customerService: CustomerService,
              public oapfcommonService: oapfcommonService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles
  }

  ngOnInit(): void {
    this.initializeColumnProperties();
    console.log('newBankAdmin is ');
    this.columns = [
      { columnDef: 'sbrId', header: 'SBR Id' },
      { columnDef: 'anchorCustomerContactName', header: 'Anchor Cust Name' },
      { columnDef: 'anchorPartyAccountId', header: 'Anchor Party Id' },
      { columnDef: 'recourseFlag', header: 'Recourse Flag' },
      { columnDef: 'transactionStatus', header: 'Trx Status' },
    ]
    this.getSBR();
  }


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.displayedColumns, event.previousIndex, event.currentIndex);
  }

  public getSBR() {
    const sb = this.oapfcommonService.getDataWithPagination('/oaadmin/api/v1/sbrs/', this.currentPage, this.pageSize,this.sortData).subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
    this.subscriptions.push(sb);
  }

  newSBR() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    // this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl';
    const modalRef = this.modalService.open(NewsbrmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      console.log('newBankAdmin is ' + result);
      this.getSBR();
    }, (reason) => {
      this.getSBR();
      this.closeResult = `Dismissed ${NewsbrComponent.getDismissReason(reason)}`;
    });
  }

  openSBRDialog(element: any, mode: any) {
    console.log("Anil Open SbR", element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    // this.modalOption.windowClass = 'my-class'
    this.modalOption.size = 'xl';
    const modalRef = this.modalService.open(NewsbrmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      console.log('Anil result', result);
      this.getSBR();
    }, (reason) => {
      this.getSBR();
      this.closeResult = `Dismissed ${NewsbrComponent.getDismissReason(reason)}`;
    });
  }

  openSBRDelete(content: any, element: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        console.log('delete--->', element.sbrId);
        this.deleteModal(element.sbrId);
      }
    }, (reason) => {
      this.getSBR();
      this.closeResult = `Dismissed ${NewsbrComponent.getDismissReason(reason)}`;
    });
  }

  private deleteModal(sbrId: any) {
    this.deleteSBR(sbrId).subscribe(() => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error, 'Delete Customer')
      console.error('There was an error!', error);
      return;
    });
  }

  deleteSBR(sbrId: any) {
    console.log(sbrId)
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(API_USERS_URL + '/api/v1/sbrs/' + sbrId, { headers: httpHeaders })
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
  }

  private static getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  errorHandle(error: { error: { message: string; }; status: any; message: any; }) {
    let errorMessage: string;
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
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
  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active + ',' + event.direction
    this.getSortsbrs(this.currentPage, this.pageSize, event.active);
  }

  public getSortsbrs(currentPage: number, pageSize: number, sortData: any) {
    const sb = this.oapfcommonService.getDataWithPagination('/oaadmin/api/v1/sbrs/', this.currentPage, this.pageSize, this.sortData).subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
    this.subscriptions.push(sb);
  }

  openFilter() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(FilterComponent, this.modalOption);
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      if (result.valid && result.value.filterOption.length > 0) {
        const sb = this.oapfcommonService.getFilterWithPagination(result, 'filter', 'oaadmin/api/v1/sbrs',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oapfcommonService.getFilterWithPagination(result, 'all', 'oaadmin/api/v1/sbrs',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  pageChanged(event: any) {
    console.log(this.sort)
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getSortsbrs(this.currentPage,this.pageSize,this.sortData);
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
      const sb = this.oapfcommonService.getFilterWithPagination(htp, 'filterByData', '/oaadmin/api/v1/agreements', this.currentPage, this.pageSize, this.sortData).subscribe((res: any) => {
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
    this.getSBR()
  }

}
