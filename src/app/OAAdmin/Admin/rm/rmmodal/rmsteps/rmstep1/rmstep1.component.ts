import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Subscription } from "rxjs";
import { NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {Customer} from "../../../../../Model/customer";
import {HttpClient} from "@angular/common/http";
import {rm} from "../../../../../Model/request/rm";

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
  form: FormGroup;
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
      this.form.disable()
    }
    if(this.mode !== 'new') {
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      rmId: [this.defaultValues.rmId,[Validators.required]],
      //name: [this.defaultValues.name,[Validators.required]],
      emailAddress: [this.defaultValues.emailAddress,[Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('rmId')?.hasError('required') ||
      this.form.get('name')?.hasError('required') ||
      this.form.get('emailAddress')?.hasError('required') ||
      this.form.get('emailAddress')?.hasError('email')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.rmId.setValue(this.formValue.rmId);
    this.f.name.setValue(this.formValue.name);
    this.f.emailAddress.setValue(this.formValue.emailAddress);
  }

  get f() {
    return this.form.controls;
  }
}
