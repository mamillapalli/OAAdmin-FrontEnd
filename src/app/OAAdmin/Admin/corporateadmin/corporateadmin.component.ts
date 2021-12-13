import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CustomerService} from "../../shared/customer.service";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../modules/auth";
import {environment} from "../../../../environments/environment";
import {CorporateadminmodalComponent} from "./corporateadminmodal/corporateadminmodal.component";
import {Corporateadmin} from "../../Model/corporateadmin";
import {BankadminmodalComponent} from "../bankadmin-maintenance/bankadminmodal/bankadminmodal.component";
import {catchError, retry} from "rxjs/operators";
import {throwError} from "rxjs";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-corporateadmin',
  templateUrl: './corporateadmin.component.html',
  styleUrls: ['./corporateadmin.component.scss']
})
export class CorporateadminComponent implements OnInit {

  displayedColumns: string[] = ['userId', 'name', 'emailAddress', 'transactionStatus', 'actions'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  dataSource: any = new MatTableDataSource<Corporateadmin>();
  @ViewChild(MatSort) sort: MatSort | any;
  authToken: any;
  posts: any;

  modalOption: NgbModalOptions = {}; // not null!
  private closeResult: string;

  constructor(private http: HttpClient, public modalService: NgbModal,public customerService: CustomerService,
              public dialog: MatDialog, private snackBar: MatSnackBar,private authService: AuthService) {
  }

  ngOnInit(): void {
    this.loadCustomerList();
  }

  private loadCustomerList() {
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });

    return this.http.get(API_USERS_URL + '/api/v1/customeradmins', {
      headers: httpHeaders,
    }).subscribe(data => {
      this.dataSource.data = data;
      console.log(data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  openCustomerDialog(element: any,mode: string) {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(CorporateadminmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.loadCustomerList();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  openDelete(content: any, post: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(post.userId);
      }
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  deleteModal(id: any) {
    this.deleteSuperAdmin(id).subscribe(res => {
    }, (error: { message: any }) => {
      console.error('There was an error!', error);
      return;
    });
  }

  deleteSuperAdmin(id: any) {
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<any>(API_USERS_URL + '/api/v1/superadmins/delete/' + id, {}, {headers: httpHeaders})
      .pipe(
        retry(1),
        catchError(this.errorHandle)
      );
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

  newBankAdmin() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(CorporateadminmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin'+result);
    }, (reason) => {
      this.loadCustomerList();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
}
