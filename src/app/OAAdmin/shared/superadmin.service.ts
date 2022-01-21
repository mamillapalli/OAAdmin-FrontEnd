import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import {ICreateAccount} from "../model/create-account.helper";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../modules/auth";
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class superadminService {

}
