import { ChangeDetectorRef, Component, Input, OnInit, ViewChild} from '@angular/core';
import { rm} from "../../../../../Model/request/rm";
import { FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription, throwError} from "rxjs";
import {ModalDismissReasons, NgbDatepicker, NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTable, MatTableDataSource} from "@angular/material/table";
import {environment} from "../../../../../../../environments/environment";
import {MatPaginator} from "@angular/material/paginator";
import {Corporateadmin} from "../../../../../Model/corporateadmin";
import {MatSort} from "@angular/material/sort";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthService} from "../../../../../../modules/auth";
import {NotificationService} from "../../../../../shared/notification.service";
import {CustomerService} from "../../../../../shared/customer.service";
import {DatePipe} from "@angular/common";
import {RmmodalComponent} from "../../rmmodal.component";
import {catchError, retry} from "rxjs/operators";
import {CustomermodalComponent} from "./customermodal/customermodal.component";
import {CustomerstablemodalComponent} from "./customermodal/customerstablemodal/customerstablemodal.component";
import {Corporates} from "../../../../../Model/corporates";
const API_USERS_URL = `${environment.apiUrl}`;

@Component({
  selector: 'app-rmstep3',
  templateUrl: './rmstep3.component.html',
  styleUrls: ['./rmstep3.component.scss']
})
export class Rmstep3Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (part: Partial<rm>,isFormValid: boolean) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<rm>;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<Corporates>();
  closeResult: string;
  displayedColumns: string[] = ['customerId', 'name', 'emailAddress', 'effectiveDate', 'expiryDate', 'status' , 'actions'];
  customers: FormArray = this.fb.array([]);

  constructor(private fb: FormBuilder,private datePipe: DatePipe,public modalService: NgbModal,) {
  }


  ngOnInit() {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new'){
      this.updateForm('');
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      customers: this.customers
    })

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      console.log(val)
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('joiningDate')?.hasError('required') ||
      this.form.get('validDate')?.hasError('required') ||
      this.form.get('expiryDate')?.hasError('required')
      //|| this.form.get('rolesName')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm(data: any)
  {

  }

  get array(): FormArray {
    return this.form.get('customers') as FormArray;
  }

  get f() {
    return this.form.controls;
  }

  openCustomerDialog() {
    const modalRef = this.modalService.open(CustomermodalComponent, { size: 'xl' });
    modalRef.result.then((result) => {
      this.dataSource.data.push(result);
      const cust = this.fb.group({
        customerId: [result.customerId,'']
      });



      this.customers.push(cust)
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      console.log(this.dataSource)
    }, (reason) => {
      console.log(reason);
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

  openRMDialog(element: any, edit: string) {

  }
}
