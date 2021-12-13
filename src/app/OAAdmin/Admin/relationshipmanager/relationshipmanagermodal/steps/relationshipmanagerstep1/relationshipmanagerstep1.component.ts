import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {rm} from "../../../../../Model/request/rm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-relationshipmanagerstep1',
  templateUrl: './relationshipmanagerstep1.component.html',
  styleUrls: ['./relationshipmanagerstep1.component.scss']
})
export class Relationshipmanagerstep1Component implements OnInit {

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
      firstName: [this.defaultValues.firstName,[Validators.required]],
      lastName: [this.defaultValues.lastName,[Validators.required]],
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
    this.f.firstName.setValue(this.formValue.firstName);
    this.f.lastName.setValue(this.formValue.lastName);
    this.f.emailAddress.setValue(this.formValue.emailAddress);
  }

  get f() {
    return this.form.controls;
  }

}
