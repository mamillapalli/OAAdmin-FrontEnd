import {Component, OnInit, TemplateRef} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../modules/auth";
import {environment} from "../../../../environments/environment";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {BankadminmodalComponent} from "./bankadminmodal/bankadminmodal.component";
import {Subject, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-bankadmin-maintenance',
  templateUrl: './bankadmin-maintenance.component.html',
  styleUrls: ['./bankadmin-maintenance.component.scss']
})
export class BankadminMaintenanceComponent implements OnInit {
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  posts: any;
  authToken: any;
  modalOption: NgbModalOptions = {}; // not null!
  private closeResult: string;

  constructor(private http: HttpClient, public modalService: NgbModal,private authService: AuthService) {
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    this.http.get(API_USERS_URL + '/api/v1/bankadmins', {
      headers: httpHeaders,
    }).subscribe(posts => {
      this.posts = posts;
      this.dtTrigger.next();
      console.log(this.posts)
    });
  }

  getAllBankAdmin(){
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    this.http.get(API_USERS_URL + '/api/v1/bankadmins', {
      headers: httpHeaders,
    }).subscribe(posts => {
      console.log(this.posts)
      this.posts = posts;
    });
  }


  newBankAdmin() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(BankadminmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin'+result);
    }, (reason) => {
      this.getAllBankAdmin();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openBankAdmin(element: any,mode: string) {
    // const modalRef = this.modalService.open(ModalComponent);
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.size = 'lg';
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(BankadminmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getAllBankAdmin();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDelete(content: TemplateRef<any>, post: any) {
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
  colorCode:string;
  getColor(post: any) {
    {
      if(post.deleteFlag)
      {
        this.colorCode = '#cc0248'
      } else if(post.transactionStatus === 'MASTER' && !post.deleteFlag) {
        this.colorCode = '#151414'
      } else {

        this.colorCode = '#36a0d5'
      }
      console.log(this.colorCode)
      return this.colorCode;
    }
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
}
