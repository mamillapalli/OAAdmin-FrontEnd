import {Component, OnInit} from '@angular/core';
import {oaCommonService} from "../../../shared/oacommon.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: 'app-batch-manager',
  templateUrl: './batch-manager.component.html',
  styleUrls: ['./batch-manager.component.scss']
})
export class BatchManagerComponent implements OnInit {
  public batchManagerForm: FormGroup;
  public unsubscribe: Subscription[] = [];

  constructor(public oaCommonService: oaCommonService, private fb: FormBuilder) {

  }

  ngOnInit(): void {
    this.batchManagerForm = this.fb.group({
      portalStatus: [],
      notificationStatus: [],
      emailStatus: [],
      financeTask: [],
      paymentTask: [],
      invValidationTask: [],
      recUploadInvoiceTask: [],
    })
    this.checkTaskStatus()
  }

  checkTaskStatus() {
    this.oaCommonService.taskManagerStatus('/oaadmin/api/v1/tasks/portal/status').subscribe((res) => {
      console.log(res)
      if (res === "true") {
        console.log(true)
        console.log(res)
        this.f.portalStatus.setValue(true)
      } else {
        console.log(false)
        console.log(res)
        this.f.portalStatus.setValue(false)
      }
    });
    this.oaCommonService.taskManagerStatus('/oaadmin/api/v1/tasks/notification/status').subscribe((res) => {
      console.log(res)
      if (res === "true") {
        console.log(true)
        console.log(res)
        this.f.notificationStatus.setValue(true)
      } else {
        console.log(false)
        console.log(res)
        this.f.notificationStatus.setValue(false)
      }
    });
    this.oaCommonService.taskManagerStatus('/oanotification/api/v1/tasks/sendEmail/status').subscribe((res) => {
      console.log(res)
      if (res === "true") {
        console.log(true)
        console.log(res)
        this.f.emailStatus.setValue(true)
      } else {
        console.log(false)
        console.log(res)
        this.f.emailStatus.setValue(false)
      }
    });
    this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/autoFinance/status').subscribe((res) => {
      console.log(res)
      if (res === "true") {
        console.log(true)
        console.log(res)
        this.f.financeTask.setValue(true)
      } else {
        console.log(false)
        console.log(res)
        this.f.financeTask.setValue(false)
      }
    });
    this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/autoPayment/status').subscribe((res) => {
      console.log(res)
      if (res === "true") {
        console.log(true)
        console.log(res)
        this.f.paymentTask.setValue(true)
      } else {
        console.log(false)
        console.log(res)
        this.f.paymentTask.setValue(false)
      }
    });
    this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/invoiceValidation/status').subscribe((res) => {
      console.log(res)
      if (res === "true") {
        console.log(true)
        console.log(res)
        this.f.invValidationTask.setValue(true)
      } else {
        console.log(false)
        console.log(res)
        this.f.invValidationTask.setValue(false)
      }
    });
    this.oaCommonService.taskManagerStatus('oapf/api/v1/tasks/recordUploadedInvoices/status').subscribe((res) => {
      console.log(res)
      if (res === "true") {
        console.log(true)
        console.log(res)
        this.f.recUploadInvoiceTask.setValue(true)
      } else {
        console.log(false)
        console.log(res)
        this.f.recUploadInvoiceTask.setValue(false)
      }
    });
    this.oaCommonService.taskManagerStatus('/oadata/api/v1/tasks/exchangeRateUpload/status').subscribe((res) => {
      console.log(res)
      if (res === "true") {
        console.log(true)
        console.log(res)
        this.f.exchangeRateTask.setValue(true)
      } else {
        console.log(false)
        console.log(res)
        this.f.exchangeRateTask.setValue(false)
      }
    });
  }

  get f() {
    return this.batchManagerForm.controls;
  }

  changeStatusTask($event: Event) {
    const val = $event.target as HTMLElement
    console.log(val.id)
    if (val.id === 'portalStatus') {
      if (this.batchManagerForm.value.portalStatus === true) {
        console.log(this.batchManagerForm.value.portalStatus)
        this.oaCommonService.taskManagerStatus('/oaadmin/api/v1/tasks/portal/start').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Portal Task has been Started',
              icon: 'success'
            });
          }
        })
      } else {
        console.log(this.batchManagerForm.value.portalStatus)
        this.oaCommonService.taskManagerStatus('/oaadmin/api/v1/tasks/portal/stop').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Portal Task has been Stopped',
              icon: 'success'
            });
          }
        })
      }
    }
    else if (val.id === 'notificationStatus') {
      if (this.batchManagerForm.value.portalStatus === true) {
        console.log(this.batchManagerForm.value.portalStatus)
        this.oaCommonService.taskManagerStatus('/oaadmin/api/v1/tasks/notification/start').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Notification Task has been Started',
              icon: 'success'
            });
          }
        })
      } else {
        console.log(this.batchManagerForm.value.portalStatus)
        this.oaCommonService.taskManagerStatus('/oaadmin/api/v1/tasks/notification/stop').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Notification Task has been Stopped',
              icon: 'success'
            });
          }
        })
      }
    }
    else if (val.id === 'emailStatus') {
      if (this.batchManagerForm.value.emailStatus === true) {
        this.oaCommonService.taskManagerStatus('/oanotification/api/v1/tasks/sendEmail/stop').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Email Task has been Started',
              icon: 'success'
            });
          }
        })
      } else {
        console.log(this.batchManagerForm.value.emailStatus)
        this.oaCommonService.taskManagerStatus('/oanotification/api/v1/tasks/sendEmail/stop').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Email Task has been Stopped',
              icon: 'success'
            });
          }
        })
      }
    }
    else if (val.id === 'financeTask') {
      if (this.batchManagerForm.value.financeTask === true) {
        this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/autoFinance/start').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Auto Finance Task has been Started',
              icon: 'success'
            });
          }
        })
      } else {
        console.log(this.batchManagerForm.value.financeTask)
        this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/autoFinance/stop').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Auto Finance Task has been Stopped',
              icon: 'success'
            });
          }
        })
      }
    }
    else if (val.id === 'paymentTask') {
      if (this.batchManagerForm.value.paymentTask === true) {
        this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/autoPayment/start').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Auto Payment Task has been Started',
              icon: 'success'
            });
          }
        })
      } else {
        console.log(this.batchManagerForm.value.paymentTask)
        this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/autoPayment/stop').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Auto Payment Task has been Stopped',
              icon: 'success'
            });
          }
        })
      }
    }
    else if (val.id === 'invValidationTask') {
      if (this.batchManagerForm.value.invValidationTask === true) {
        this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/invoiceValidation/start').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Invoice Validation Task has been Started',
              icon: 'success'
            });
          }
        })
      } else {
        this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/invoiceValidation/stop').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Invoice Validation Task has been Stopped',
              icon: 'success'
            });
          }
        })
      }
    }
    else if (val.id === 'recUploadInvoiceTask') {
      if (this.batchManagerForm.value.recUploadInvoiceTask === true) {
        this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/recordUploadedInvoices/start').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Record Upload Invoices Task has been Started',
              icon: 'success'
            });
          }
        })
      } else {
        this.oaCommonService.taskManagerStatus('/oapf/api/v1/tasks/recordUploadedInvoices/stop').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Record Upload Invoices Task has been Stopped',
              icon: 'success'
            });
          }
        })
      }
    }
    else if (val.id === 'exchangeRateTask') {
      if (this.batchManagerForm.value.exchangeRateTask === true) {
        this.oaCommonService.taskManagerStatus('/oadata/api/v1/tasks/exchangeRateUpload/start').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Record Upload Invoices Task has been Started',
              icon: 'success'
            });
          }
        })
      } else {
        this.oaCommonService.taskManagerStatus('/oadata/api/v1/tasks/exchangeRateUpload/stop').subscribe((res) => {
          if (res !== undefined) {
            Swal.fire({
              title: 'Record Upload Invoices Task has been Stopped',
              icon: 'success'
            });
          }
        })
      }
    }
  }
}
