import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {environment} from "../../../environments/environment";
import {AuthService} from "../../modules/auth";
const API_USERS_URL = `${environment.apiUrl}`;

@Injectable({
  providedIn: 'root'
})
export class CorportateServices {
  constructor(private http: HttpClient,private authService: AuthService) { }




}
