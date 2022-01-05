import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {AuthService} from "../../../modules/auth";
import {NotificationService} from "../../shared/notification.service";
import {Subscription, throwError} from "rxjs";
import {CorporateusermodalComponent} from "./corporateusermodal/corporateusermodal.component";
import {DatePipe} from "@angular/common";
import {NgxSpinnerService} from "ngx-spinner";
import {FilterComponent} from "../../OAPF/common/filter/filter.component";
import {oaCommonService} from "../../shared/oacommon.service";
import {corporateUser} from "../../Model/OAAdmin/Request/corporateUser";
import Swal from "sweetalert2";

@Component({
  providers: [DatePipe],
  selector: 'app-corporateuser',
  templateUrl: './corporateuser.component.html',
  styleUrls: ['./corporateuser.component.scss']
})
export class CorporateuserComponent implements OnInit {
  dataSource: any = new MatTableDataSource<corporateUser>();
  displayedColumns: string[] = ['userId', 'firstName', 'lastName', 'expiryDate', 'transactionStatus', 'status', 'actions'];
  fDisplayedColumns: string[] = ['userId', 'firstName', 'lastName', 'expiryDate', 'transactionStatus', 'status'];
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
    this.getCorporateUser();
  }

  public getCorporateUser() {
    this.spinner.show();
    const sb = this.oaCommonService.getMethod('/oaadmin/api/v1/customerusers', '',).subscribe((res) => {
      this.dataSource.data = res;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoading$ = false;
      this.spinner.hide();
    });
    this.subscriptions.push(sb);
  }


  newCorporateUser() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(CorporateusermodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newbankadmins is ' + result);
    }, (reason) => {
      this.getCorporateUser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCorporateAdminDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.size = 'lg'
    const modalRef = this.modalService.open(CorporateusermodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getCorporateUser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCorporateAdminDelete(content: any, element: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element);
      }
    }, (reason) => {
      this.getCorporateUser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(data: any) {
    this.oaCommonService.dataItem(data, data.userId, 'delete', '/oaadmin/api/v1/customerusers/delete/').subscribe(res => {
      if (res !== undefined) {
        Swal.fire({
          title: 'Delete Record Successfully',
          icon: 'success'
        });
      }
    }, (error: { message: any }) => {
      this.notifyService.showError(error, 'Delete Customer')
      console.error('There was an error!', error);
      return;
    });
  }

  getDismissReason(reason: any): string {
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
        const sb = this.oaCommonService.getFilter(result, 'filter', '/oaadmin/api/v1/customerusers').subscribe((res: any) => {
          this.dataSource.data = res;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.subscriptions.push(sb);
      } else {
        const sb = this.oaCommonService.getFilter(result, 'all', '/oaadmin/api/v1/customerusers').subscribe((res: any) => {
          this.dataSource.data = res;
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        });
        this.subscriptions.push(sb);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


}
