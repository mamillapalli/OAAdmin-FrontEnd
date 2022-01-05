import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Subscription } from "rxjs";
import { NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {Customer} from "../../../../../Model/customer";
import {HttpClient} from "@angular/common/http";
import {rm} from "../../../../../Model/OAAdmin/Request/rm";

@Component({
  selector: 'app-rmstep1',
  templateUrl: './rmstep1.component.html',
  styleUrls: ['./rmstep1.component.scss']
})
export class Rmstep1Component implements OnInit {

  @Input('updateParentModel') updateParentModel: (
    part: Partial<rm>,
    isFormValid: boolean
  ) => void;
  rmStep1Form: FormGroup;
  @Input() defaultValues: Partial<rm>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  dataSource: any = new MatTableDataSource<rm>();
  clickedRows = new Set<Customer>();

  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal) {}

  ngOnInit() {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.rmStep1Form.disable()
    }
    if(this.mode !== 'new') {
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.rmStep1Form = this.fb.group({
      rmId: [this.defaultValues.rmId,[Validators.required]],
      firstName: [this.defaultValues.firstName,[Validators.required]],
      lastName: [this.defaultValues.lastName,[Validators.required]],
      emailAddress: [this.defaultValues.emailAddress,[Validators.required]],
    });

    const formChangesSubscr = this.rmStep1Form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {

    this.markFormGroupTouched(this.rmStep1Form);

    console.log('form', this.rmStep1Form)

    return !(
      this.rmStep1Form.get('rmId')?.hasError('required') ||
      this.rmStep1Form.get('name')?.hasError('required') ||
      this.rmStep1Form.get('emailAddress')?.hasError('required') ||
      this.rmStep1Form.get('emailAddress')?.hasError('email')
    );
  }

  public markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      console.log('markFormGroupTouched'+formGroup.controls[key])
    });
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.rmStep1Form.setValue(this.formValue)
    // this.f.rmId.setValue(this.formValue.rmId);
    // this.f.name.setValue(this.formValue.name);
    // this.f.emailAddress.setValue(this.formValue.emailAddress);
  }

  get f() {
    return this.rmStep1Form.controls;
  }
}
