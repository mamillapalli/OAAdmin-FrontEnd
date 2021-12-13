import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Corporateuser} from "../../../../../Model/corporateuser";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {Customer} from "../../../../../Model/customer";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-bankuserstep1',
  templateUrl: './bankuserstep1.component.html',
  styleUrls: ['./bankuserstep1.component.scss']
})
export class Bankuserstep1Component implements OnInit {
   @Input('updateParentModel') updateParentModel: (
    part: Partial<Corporateuser>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Corporateuser>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  customerList: any;
  authToken: any;
  dataSource: any = new MatTableDataSource<Corporateuser>();
  public displayedColumns: string[] = ['customerId', 'name', 'emailAddress','status','transactionStatus'];
  clickedRows = new Set<Customer>();

  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal) {}

  ngOnInit() {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new') {
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      userId: [this.defaultValues.userId,[Validators.required]],
      firstName: [this.defaultValues.firstName,[Validators.required]],
      lastName: [this.defaultValues.lastName,[Validators.required]],
      emailAddress: [this.defaultValues.emailAddress,[Validators.required, Validators.email]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('userId')?.hasError('required') ||
      this.form.get('firstName')?.hasError('required') ||
      this.form.get('lastName')?.hasError('required') ||
      this.form.get('emailAddress')?.hasError('required') ||
      this.form.get('emailAddress')?.hasError('email')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.userId.setValue(this.formValue.userId);
    this.f.firstName.setValue(this.formValue.firstName);
    this.f.lastName.setValue(this.formValue.lastName);
    this.f.emailAddress.setValue(this.formValue.emailAddress);
  }

  get f() {
    return this.form.controls;
  }
}
