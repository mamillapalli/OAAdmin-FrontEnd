import { Injectable } from '@angular/core';

import {Toast, ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {


  constructor(private toastr: ToastrService) { }

  showSuccess(message: any, title:any){
    this.toastr.toastrConfig
    this.toastr.success(message, title)
  }

  showError(message: any, title:any){
    console.log(message)
    this.toastr.error(message, title)
  }

  showInfo(message: any, title:any){
    this.toastr.info(message, title)
  }

  showWarning(message: any, title:any){
    this.toastr.warning(message, title)
  }

}
