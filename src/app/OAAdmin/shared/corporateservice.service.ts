import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {BehaviorSubject, Observable, of, Subscription, throwError} from 'rxjs';
import {retry, catchError, map, exhaustMap, finalize} from 'rxjs/operators';
import {ICreateAccount} from "../model/create-account.helper";
import {environment} from "../../../environments/environment";
import {AuthService} from "../../modules/auth";
import {Corporates} from "../Model/corporates";
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class CorportateServices {
  constructor(private http: HttpClient,private authService: AuthService) { }




}
