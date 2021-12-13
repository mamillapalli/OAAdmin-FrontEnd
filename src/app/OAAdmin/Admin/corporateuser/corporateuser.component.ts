import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {Corporateadmin} from "../../Model/corporateadmin";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../modules/auth";
import {NotificationService} from "../../shared/notification.service";
import {CustomerService} from "../../shared/customer.service";
import {CorporatesmodalComponent} from "../corporates/corporatesmodal/corporatesmodal.component";
import {catchError, retry} from "rxjs/operators";
import {throwError} from "rxjs";
import {environment} from "../../../../environments/environment";
import {CorporateusermodalComponent} from "./corporateusermodal/corporateusermodal.component";
const API_USERS_URL = `${environment.apiUrl}`;
import {DatePipe} from "@angular/common";
@Component({
  providers: [DatePipe],
  selector: 'app-corporateuser',
  templateUrl: './corporateuser.component.html',
  styleUrls: ['./corporateuser.component.scss']
})
export class CorporateuserComponent implements OnInit {

  dataSource: any = new MatTableDataSource<Corporateadmin>();
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
    this.getCorporateuser();
  }

  public getCorporateuser() {
    this.isLoading = true;
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    return this.http.get(API_USERS_URL + '/api/v1/customerusers', {
      headers: httpHeaders,
    }).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  newCorporates() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(CorporateusermodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin is '+result);
    }, (reason) => {
      this.getCorporateuser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCorporateuserDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(CorporateusermodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getCorporateuser();
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
      this.getCorporateuser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(customerId:any) {
    this.deleteCorporates(customerId).subscribe(res => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error,'Delete Customer')
      console.error('There was an error!', error);
      return;
    });
  }

  deleteCorporates(userId: any) {
    console.log(userId)
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(API_USERS_URL + '/api/v1/customerusers/' + userId, {headers: httpHeaders})
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
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
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
