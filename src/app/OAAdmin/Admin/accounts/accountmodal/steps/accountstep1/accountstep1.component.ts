import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {NgbModal, NgbModalOptions} from "@ng-bootstrap/ng-bootstrap";
import {MatTableDataSource} from "@angular/material/table";
import {corporateUser} from "../../../../../Model/OAAdmin/Request/corporateUser";
import {Customer} from "../../../../../Model/customer";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { currencyList } from 'src/app/OAAdmin/shared/currency';
import {Accounts} from "../../../../../Model/OAAdmin/Request/accounts";
import {HttpClient} from "@angular/common/http";
import {DatePipe} from "@angular/common";
@Component({
  selector: 'app-accountstep1',
  templateUrl: './accountstep1.component.html',
  styleUrls: ['./accountstep1.component.scss']
})
export class Accountstep1Component implements OnInit {
  @Input('updateParentModel') updateParentModel: (
    part: Partial<Accounts>,
    isFormValid: boolean
  ) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<Accounts>;

  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild('myModal') myModal: any;
  modalOption: NgbModalOptions = {}; // not null!
  public content: any;
  customerList: any;
  authToken: any;
  dataSource: any = new MatTableDataSource<corporateUser>();
  public displayedColumns: string[] = ['sbrId','anchorCustomer','counterParty','agreement'];
  clickedRows = new Set<Customer>();
  public currencyList:any = currencyList;
  public closeResult: string;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  constructor(private http: HttpClient,private fb: FormBuilder,public modalService: NgbModal) { }

  ngOnInit(): void {
    this.initForm();
    if(this.mode === 'auth' || this.mode === 'delete' || this.mode === 'view')
    {
      this.form.disable()
    }
    if(this.mode !== 'new') {
      this.f.accountId.disabled
      this.updateForm();
    }
    this.updateParentModel({}, this.checkForm());
  }

  initForm() {
    this.form = this.fb.group({
      accountId: [this.defaultValues.accountId,[Validators.required]],
      name: [this.defaultValues.name,[Validators.required]],
      type: [this.defaultValues.type,[Validators.required]],
      currency: [this.defaultValues.currency,[Validators.required]],
      description: ['',[Validators.required]],
    });

    const formChangesSubscr = this.form.valueChanges.subscribe((val) => {
      this.updateParentModel(val, this.checkForm());
    });
    this.unsubscribe.push(formChangesSubscr);
  }

  checkForm() {
    return !(
      this.form.get('accountId')?.hasError('required') ||
      this.form.get('name')?.hasError('required') ||
      this.form.get('type')?.hasError('required') ||
      this.form.get('description')?.hasError('required') ||
      this.form.get('currency')?.hasError('required')
    );
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  updateForm()
  {
    this.f.accountId.setValue(this.formValue.accountId);
    this.f.name.setValue(this.formValue.name);
    this.f.type.setValue(this.formValue.type);
    this.f.description.setValue(this.formValue.description);
    this.f.currency.setValue(this.formValue.currency);
    this.form.patchValue(this.formValue)
  }

  get f() {
    return this.form.controls;
  }

  isControlValid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.form.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation: string, controlName: string) {
    const control = this.form.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName: string): boolean {
    // const control = this.form.controls[controlName];
    return false;
  }

  createFilter(): (data: any, filter: string) => boolean {
    let filterFunction = function(data: { firstName: string; }, filter: string): boolean {
      let searchTerms = JSON.parse(filter);
      return data.firstName.toLowerCase().indexOf(searchTerms.firstName) !== -1
    }
    return filterFunction;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
