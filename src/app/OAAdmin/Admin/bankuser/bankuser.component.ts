import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../modules/auth";
import {NotificationService} from "../../shared/notification.service";
import {CustomerService} from "../../shared/customer.service";
import {DatePipe} from "@angular/common";
import {catchError, retry} from "rxjs/operators";
import {throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {BankusermodalComponent} from "./bankusermodal/bankusermodal.component";
import {bankuser} from "../../Model/request/bankuser";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-bankuser',
  templateUrl: './bankuser.component.html',
  styleUrls: ['./bankuser.component.scss']
})
export class BankuserComponent implements OnInit {

  dataSource: any = new MatTableDataSource<bankuser>();
  displayedColumns: string[] = ['userId', 'name', 'effectiveDate', 'expiryDate', 'status', 'transactionStatus', 'actions'];
  authToken: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  modalOption: NgbModalOptions = {}; // not null!
  closeResult: string;
  colorCode:string;
  isLoading: any;
  public time: string | null;

  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService : NotificationService,
              public customerService: CustomerService,
              private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.time = this.datePipe.transform(new Date());
    this.getBankUser();
  }

  public getBankUser() {
    this.isLoading = true;
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    return this.http.get(API_USERS_URL + '/api/v1/bankusers', {
      headers: httpHeaders,
    }).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  newBankUser() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(BankusermodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBank user is '+result);
    }, (reason) => {
      this.getBankUser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openBankUserDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(BankusermodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getBankUser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDelete(content:any, element: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element.customerId);
      }
    }, (reason) => {
      this.getBankUser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(customerId:any) {
    this.deleteBankUser(customerId).subscribe(res => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error,'Delete Customer')
      console.error('There was an error!', error);
      return;
    });
  }

  deleteBankUser(userId: any) {
    console.log(userId)
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(API_USERS_URL + '/api/v1/bankusers/' + userId, {headers: httpHeaders})
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
      if(post.deleteFlag)
      {
        this.colorCode = '#cc0248'
      } else if(post.transactionStatus === 'MASTER') {
        this.colorCode = '#151414'
      } else {

        this.colorCode = '#5db6e3'
      }
      return this.colorCode;
    }
  }


}
