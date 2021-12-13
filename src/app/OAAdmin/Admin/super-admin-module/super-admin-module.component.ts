import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthModel} from "../../../modules/auth/models/auth.model";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../modules/auth";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {Subject, throwError} from "rxjs";
import {catchError, retry} from "rxjs/operators";
import {DataTableDirective} from "angular-datatables";
import {SuperAdminModalComponent} from "./super-admin-modal/super-admin-modal.component";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-super-admin-module',
  templateUrl: './super-admin-module.component.html',
  styleUrls: ['./super-admin-module.component.scss']
})
export class SuperAdminModuleComponent implements OnInit {

  @ViewChild(DataTableDirective, {static: false})
  dtElement: DataTableDirective;
  subscription : any;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();
  rows = [];
  posts: any;
  authToken: any;
  min: any = 0;
  max: any = 0;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  deleteMode = false;
  private closeResult: string;

  constructor(private http: HttpClient, public modalService: NgbModal,private authService: AuthService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
    this.getAllAdmin();
  }

  getAllAdmin(){
    this.authToken = this.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    this.http.get(API_USERS_URL + '/api/v1/superadmins', {
      headers: httpHeaders,
    }).subscribe(posts => {
      console.log(this.posts)
      this.posts = posts;
      this.dtTrigger.next();
    });
  }

  filterById(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.draw();
    });
  }



  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      dtInstance.destroy();
      // Call the dtTrigger to rerender again
      this.dtTrigger.next();
    });
  }

  private getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }
      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
  modalOption: NgbModalOptions = {}; // not null!
  open(element: any,mode: string) {
    console.log(element);
    // const modalRef = this.modalService.open(ModalComponent);
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.size = 'lg';
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(SuperAdminModalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
    });
  }

  newAdmin() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    //this.modalOption.size = 'lg';
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(SuperAdminModalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log(result);
    }, () => {
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    $.fn.dataTable.ext.search.pop();
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
  colorcode:string;
  getColor(post: any) {
    {
      if(post.deleteFlag)
      {
        this.colorcode = '#cc0248'
      } else if(post.transactionStatus === 'MASTER' && !post.deleteFlag) {
        this.colorcode = '#151414'
      } else {

        this.colorcode = '#36a0d5'
      }
      console.log(this.colorcode)
      return this.colorcode;
    }
  }

}
