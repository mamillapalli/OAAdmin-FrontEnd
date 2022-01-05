import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import { NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {rm} from "../../../../../Model/OAAdmin/Request/rm";

@Component({
  selector: 'app-rmstep2',
  templateUrl: './rmstep2.component.html',
  styleUrls: ['./rmstep2.component.scss']
})
export class Rmstep2Component implements OnInit {
  expiryDate: any
  @Input('updateParentModel') updateParentModel: (part: Partial<rm>,isFormValid: boolean) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<rm>;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;

  date: {
    year: number,
    month: number
  };
  @ViewChild('dp') dp: NgbDatepicker;
  joiningDate: any;
  validDate: any;

  constructor(private fb: FormBuilder,private datePipe: DatePipe) {
  }


  ngOnInit() {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new'){
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      joiningDate: ['',Validators.required],
      validDate: ['',Validators.required],
      expiryDate: ['',Validators.required],
      status: []
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
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

  updateForm()
  {
    const efDate = this.datePipe.transform(new Date(this.formValue.joiningDate), "yyyy-MM-dd");
    this.f.joiningDate.setValue(efDate);
    const exDate = this.datePipe.transform(new Date(this.formValue.expiryDate), "yyyy-MM-dd");
    this.f.expiryDate.setValue(exDate);
    const vaDate = this.datePipe.transform(new Date(this.formValue.validDate), "yyyy-MM-dd");
    this.f.validDate.setValue(vaDate);
    this.f.status.setValue(this.formValue.status);
  }

  get f() {
    return this.form.controls;
  }

}
