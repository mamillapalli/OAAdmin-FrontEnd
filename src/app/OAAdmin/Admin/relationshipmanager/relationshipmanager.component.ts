import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../modules/auth";
import {RelationshipmanagermodalComponent} from "./relationshipmanagermodal/relationshipmanagermodal.component";
import {MatTableDataSource} from "@angular/material/table";
import {rm} from "../../Model/request/rm";
import {RmmodalComponent} from "../rm/rmmodal/rmmodal.component";
import {catchError, retry} from "rxjs/operators";
import {throwError} from "rxjs";
import {NotificationService} from "../../shared/notification.service";
const API_USERS_URL = `${environment.apiUrl}`;
@Component({
  selector: 'app-relationshipmanager',
  templateUrl: './relationshipmanager.component.html',
  styleUrls: ['./relationshipmanager.component.scss']
})
export class RelationshipmanagerComponent implements OnInit {
  authToken: any;
  isLoading: any;
  dataSource: any = new MatTableDataSource<rm>();
  displayedColumns: string[] = ['rmId', 'emailAddress', 'joiningDate', 'expiryDate' , 'transactionStatus', 'actions']
  modalOption: NgbModalOptions = {}; // not null!
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  private closeResult: string;


  constructor(public modalService: NgbModal,public http: HttpClient,
  public authService: AuthService,public notifyService : NotificationService) { }

  ngOnInit(): void {
    this.getRMUser();
  }

  newRM() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(RelationshipmanagermodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin is '+result);
    }, (reason) => {
      this.getRMUser();
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

  applyFilter($event: KeyboardEvent) {

  }

  openRMDialog(element: any, mode: any) {
    console.log(element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(RelationshipmanagermodalComponent, this.modalOption);

    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
      this.getRMUser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openRMDelete(content:any, element: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element.customerId);
      }
    }, (reason) => {
      this.getRMUser();
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private deleteModal(customerId:any) {
    this.deleteRMUser(customerId).subscribe(res => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error,'Delete Customer')
      console.error('There was an error!', error);
      return;
    });
  }

  deleteRMUser(userId: any) {
    console.log(userId)
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(API_USERS_URL + '/api/v1/rms/' + userId, {headers: httpHeaders})
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

  public getRMUser() {
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    return this.http.get(API_USERS_URL + '/api/v1/rms', {
      headers: httpHeaders,
    }).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.dataSource.filterPredicate = (data:{name: string}, filterValue: string) =>
        data.name.trim().toLowerCase().indexOf(filterValue) !== -1;
    });
  }
}
