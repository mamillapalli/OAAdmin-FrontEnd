import {Component, OnInit, Output, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../modules/auth";
import {MatTableDataSource} from "@angular/material/table";
import {Subscription, throwError} from "rxjs";
import {NotificationService} from "../../shared/notification.service";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {FilterComponent} from "../../OAPF/common/filter/filter.component";
import {oaCommonService} from "../../shared/oacommon.service";
import {rm} from "../../Model/OAAdmin/Request/rm"
import {RelationshipmanagermodalComponent} from "./relationshipmanagermodal/relationshipmanagermodal.component";
import {CdkDragDrop, moveItemInArray} from "@angular/cdk/drag-drop";
import { CustomColumn } from '../../Model/CustomColumn';
import {CONDITIONS_FUNCTIONS, CONDITIONS_LIST } from '../super-admin-module/super-admin-module.component';

@Component({
  selector: 'app-relationshipmanager',
  templateUrl: './relationshipmanager.component.html',
  styleUrls: ['./relationshipmanager.component.scss']
})
export class RelationshipmanagerComponent implements OnInit {
  dataSource: any = new MatTableDataSource<rm>();
  @Output()  displayedColumns:  string[] = ['columnSetting','rmId', 'firstName', 'lastName' , 'emailAddress', 'expiryDate', 'transactionStatus','actions'];
  @Output()  fDisplayedColumns: string[] = ['rmId', 'firstName', 'lastName' , 'emailAddress', 'lastName','expiryDate', 'transactionStatus'];
  authToken: any;
  modalOption: NgbModalOptions = {};
  closeResult: string;
  isLoading: any;

  private subscriptions: Subscription[] = [];
  isLoading$: any;
  authRoles : any

  //sort
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData : any

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

  constructor(
    public authService: AuthService,
    public modalService: NgbModal,
    public notifyService: NotificationService,
    private datePipe: DatePipe,
    private spinner: NgxSpinnerService,
    public oaCommonService: oaCommonService) {
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles

  }

  ngOnInit(): void {
    this.initializeColumnProperties();
    this.getRM();
    this.columns = [
      { columnDef: 'rmId', header: 'User Id' },
      { columnDef: 'firstName', header: 'First Name' },
      { columnDef: 'lastName', header: 'Last Name' },
      { columnDef: 'expiryDate', header: 'Expiry Date' },
      { columnDef: 'emailAddress', header: 'Email Address' },
      { columnDef: 'transactionStatus', header: 'Trx Status' }
    ]
  }

  public getRM() {
    const sb = this.oaCommonService.getMethodWithPagination('/oaadmin/api/v1/rms', '', this.currentPage, this.pageSize, this.sortData ).subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
    this.subscriptions.push(sb);
  }

  rm() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(RelationshipmanagermodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      console.log('newbankadmins is ' + result);
      this.getRM();
    }, (reason) => {
      this.getRM();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openRMDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'xl'
    const modalRef = this.modalService.open(RelationshipmanagermodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.componentInstance.displayedColumns = this.displayedColumns;
    modalRef.componentInstance.fDsplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      console.log(result);
      this.getRM();
    }, (reason) => {
      this.getRM();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openRM(content: any, element: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element);
        this.getRM();
      }
    }, (reason) => {
      this.getRM();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(data: any) {
    this.oaCommonService.dataItem(data, data.rmId, 'delete', '/oaadmin/api/v1/rms/delete/').subscribe(res => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error, 'Delete Customer')
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

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  openFilter() {
    console.log('open filter')
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    const modalRef = this.modalService.open(FilterComponent, this.modalOption);
    console.log(this.fDisplayedColumns)
    modalRef.componentInstance.fDisplayedColumns = this.fDisplayedColumns;
    modalRef.result.then((result) => {
      if (result.valid && result.value.filterOption.length > 0) {
        const sb = this.oaCommonService.getFilter(result, 'filter', '/oaadmin/api/v1/rms').subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oaCommonService.getFilter(result, 'all', '/oaadmin/api/v1/rms').subscribe((res: any) => {
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

  pageChanged(event: any) {
    console.log(this.sort)
    console.log({ event });
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getRM();
  }

  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active+','+event.direction
    this.getRM();
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
      const sb = this.oaCommonService.getFilterWithPagination(htp, 'filterByData', '/oaadmin/api/v1/rms', this.currentPage, this.pageSize, this.sortData).subscribe((res: any) => {
        this.dataSource.data = res.content;
        this.totalRows = res.totalElements
      });
      this.subscriptions.push(sb);
    }

    //this.dataSource.filter = searchFilter;
  }

  clearColumn(event:any,columnKey: string): void {
    console.log(columnKey)
    this.searchValue[columnKey] = null;
    this.searchCondition[columnKey] = "none";
    this.applyFilter(null,null);
    this.getRM()
  }

}
