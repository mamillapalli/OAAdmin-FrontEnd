import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Subscription, throwError} from 'rxjs';
import {ICreateAccount} from "../../../../../modules/wizards/create-account.helper";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {ModalDismissReasons, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../../../modules/auth";
import {NotificationService} from "../../../../shared/notification.service";
import {CustomerService} from "../../../../shared/customer.service";
import {DatePipe} from "@angular/common";
import {catchError, retry} from "rxjs/operators";
import {environment} from "../../../../../../environments/environment";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-agreement-end',
  templateUrl: './agreement-end.component.html',
  styleUrls: ['./agreement-end.component.scss']
})
export class AgreementEndComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
