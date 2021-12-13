import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {rm} from "../../../../../Model/request/rm";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbDatepicker} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";

@Component({
  selector: 'app-relationshipmanagerstep2',
  templateUrl: './relationshipmanagerstep2.component.html',
  styleUrls: ['./relationshipmanagerstep2.component.scss']
})
export class Relationshipmanagerstep2Component implements OnInit {

  expiryDate: any
  joiningDate: any
  @Input('updateParentModel') updateParentModel: (part: Partial<rm>,isFormValid: boolean) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<rm>;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;

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
      //validDate: ['',Validators.required],
      expiryDate: ['',Validators.required],
      status: [true,Validators.required]
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('joiningDate')?.hasError('required') ||
      //this.form.get('validDate')?.hasError('required') ||
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
    this.f.status.setValue(this.formValue.status);
  }

  get f() {
    return this.form.controls;
  }


}
