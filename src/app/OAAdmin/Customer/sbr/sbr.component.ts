import {Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {AuthService} from "../../../modules/auth";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {Sbr} from "../../Model/sbr";
import {SbrmodalComponent} from "./sbrmodal/sbrmodal.component";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {catchError, retry} from "rxjs/operators";
import {throwError} from "rxjs";
import {NotificationService} from "../../shared/notification.service";
import {CustomerService} from "../../shared/customer.service";
const API_USERS_URL = `${environment.apiUrl}`;


@Component({
  selector: 'app-sbr',
  templateUrl: './sbr.component.html',
  styleUrls: ['./sbr.component.scss']
})
export class SBRComponent implements OnInit {
  dataSource: any = new MatTableDataSource<Sbr>();
  displayedColumns: string[] = ['sbrId', 'anchorCustomerContactName', 'anchorPartyAccountId', 'recourseFlag', 'actions'];
  authToken: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  modalOption: NgbModalOptions = {}; // not null!
  closeResult: string;
  colorCode: string;
  isLoading: any;

  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbModal,
              public notifyService: NotificationService,
              public customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.getSBR();
  }


  public getSBR() {
    this.isLoading = true;
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    return this.http.get(API_USERS_URL + '/api/v1/sbrs', {
      headers: httpHeaders,
    }).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  newSBR() {
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(SbrmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = 'new';
    modalRef.result.then((result) => {
      console.log('newBankAdmin is '+result);
    }, (reason) => {
      this.getSBR();
      this.closeResult = `Dismissed ${SBRComponent.getDismissReason(reason)}`;
    });
  }

  openSBRDialog(element: any, mode: any) {
    console.log("Anil Open SbR",element)
    this.modalOption.backdrop = 'static';
    this.modalOption.keyboard = false;
    this.modalOption.windowClass = 'my-class'
    const modalRef = this.modalService.open(SbrmodalComponent, this.modalOption);
    modalRef.componentInstance.mode = mode;
    modalRef.componentInstance.fromParent = element;
    modalRef.result.then((result) => {
      console.log('Anil result',result);
    }, (reason) => {
      this.getSBR();
      this.closeResult = `Dismissed ${SBRComponent.getDismissReason(reason)}`;
    });
  }

  openSBRDelete(content:any, element: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      if (result === 'yes') {
        this.deleteModal(element.contractReferenceNumber);
      }
    }, (reason) => {
      this.getSBR();
      this.closeResult = `Dismissed ${SBRComponent.getDismissReason(reason)}`;
    });
  }

  private deleteModal(sbrId:any) {
    this.deleteSBR(sbrId).subscribe(() => {
    }, (error: { message: any }) => {
      this.notifyService.showError(error,'Delete Customer')
      console.error('There was an error!', error);
      return;
    });
  }

  deleteSBR(userId: any) {
    console.log(userId)
    const auth = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${auth?.jwt}`,
      'Content-Type': 'application/json'
    });
    return this.http.delete<any>(API_USERS_URL + '/api/v1/sbrs/' + userId, {headers: httpHeaders})
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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
 