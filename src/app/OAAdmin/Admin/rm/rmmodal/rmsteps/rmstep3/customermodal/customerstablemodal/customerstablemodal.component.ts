import {Component, OnInit, ViewChild} from '@angular/core';
import { NgbActiveModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../../../../../../modules/auth";
import {NotificationService} from "../../../../../../../shared/notification.service";
import {CustomerService} from "../../../../../../../shared/customer.service";
import {environment} from "../../../../../../../../../environments/environment";
import {corporates} from "../../../../../../../Model/OAAdmin/Request/corporates";

const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-customerstablemodal',
  templateUrl: './customerstablemodal.component.html',
  styleUrls: ['./customerstablemodal.component.scss']
})
export class CustomerstablemodalComponent implements OnInit {

  dataSource: any = new MatTableDataSource<corporates>();
  displayedColumns: string[] = ['customerId', 'name', 'emailAddress', 'transactionStatus', 'status'];
  authToken: any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  modalOption: NgbModalOptions = {}; // not null!
  closeResult: string;
  colorCode: string;
  isLoading: any;

  constructor(public http: HttpClient,
              public authService: AuthService,
              public modalService: NgbActiveModal,
              public notifyService: NotificationService,
              public customerService: CustomerService) {
  }

  ngOnInit(): void {
    this.getCorporates();
  }

  public getCorporates() {
    this.isLoading = true;
    this.authToken = this.authService.getAuthFromLocalStorage();
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.authToken?.jwt}`,
    });
    return this.http.get(API_USERS_URL + '/api/v1/customers', {
      headers: httpHeaders,
    }).subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  c(row:any) {
    this.modalService.close(row)
  }
}
