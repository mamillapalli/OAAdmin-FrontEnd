import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthModel} from "../../../modules/auth/models/auth.model";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../modules/auth";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Subject, Subscription, throwError} from "rxjs";
import {SuperAdminModalComponent} from "./super-admin-modal/super-admin-modal.component";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {NotificationService} from "../../shared/notification.service";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {FilterComponent} from "../../OAPF/common/filter/filter.component";
import {oaCommonService} from "../../shared/oacommon.service";
import {superAdmin} from "../../Model/super-admin";

@Component({
  selector: 'app-super-admin-module',
  templateUrl: './super-admin-module.component.html',
  styleUrls: ['./super-admin-module.component.scss']
})
export class SuperAdminModuleComponent implements OnInit {
  dataSource: any = new MatTableDataSource<superAdmin>();
  displayedColumns: string[] = ['userId', 'firstName', 'lastName', 'expiryDate', 'emailAddress', 'transactionStatus', 'actions'];
  fDisplayedColumns: string[] = ['userId', 'firstName', 'lastName', 'expiryDate', 'emailAddress', 'transactionStatus']
  authToken: any;
  modalOption: NgbModalOptions = {};
  closeResult: string;
  isLoading: any;
  private subscriptions: Subscription[] = [];
  isLoading$: any;
  authRoles: any
  //SORTING
  totalRows = 0;
  pageSize = 5;
  currentPage = 0;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  sortData: any

  constructor(public http: HttpClient,
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
    this.getSuperAdmin();
  }

  public getSuperAdmin() {
    const sb = this.oaCommonService.getMethodWithPagination('/oaadmin/api/v1/superadmins', '', this.currentPage, this.pageSize, this.sortData).subscribe((res) => {
      this.dataSource.data = res.content;
      this.totalRows = res.totalElements
    });
    this.subscriptions.push(sb);
  }

  newSuperAdmin() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(SuperAdminModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newSuperAdmin is ' + result);
    }, (reason) => {
      this.getSuperAdmin();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openSuperAdminDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(SuperAdminModalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getSuperAdmin();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openSuperAdminDelete(content: any, element: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element);
      }
    }, (reason) => {
      this.getSuperAdmin();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(data: any) {
    this.oaCommonService.dataItem(data, data.userId, 'delete', '/oaadmin/api/v1/superadmins/delete').subscribe(res => {
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
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
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
        const sb = this.oaCommonService.getFilterWithPagination(result, 'filter', '/oaadmin/api/v1/superadmins',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
          this.dataSource.data = res.content;
          this.totalRows = res.totalElements
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oaCommonService.getFilterWithPagination(result, 'all', '/oaadmin/api/v1/superadmins',this.currentPage,this.pageSize,this.sortData).subscribe((res: any) => {
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
    console.log({event});
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.getSuperAdmin();
  }

  sortChanges(event: Sort) {
    console.log(event.direction)
    this.sortData = event.active + ',' + event.direction
    this.getSuperAdmin();
  }
}
