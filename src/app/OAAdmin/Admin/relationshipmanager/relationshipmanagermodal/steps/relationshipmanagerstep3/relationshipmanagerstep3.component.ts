import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {rm} from "../../../../../Model/OAAdmin/Request/rm";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTableDataSource} from "@angular/material/table";
import {DatePipe} from "@angular/common";
import {ModalDismissReasons, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomermodalComponent} from "../../../../rm/rmmodal/rmsteps/rmstep3/customermodal/customermodal.component";
import {corporates} from "../../../../../Model/OAAdmin/Request/corporates";

@Component({
  selector: 'app-relationshipmanagerstep3',
  templateUrl: './relationshipmanagerstep3.component.html',
  styleUrls: ['./relationshipmanagerstep3.component.scss']
})
export class Relationshipmanagerstep3Component implements OnInit {

  @Input('updateParentModel') updateParentModel: (part: Partial<rm>,isFormValid: boolean) => void;
  form: FormGroup;
  @Input() defaultValues: Partial<rm>;
  private unsubscribe: Subscription[] = [];
  @Input('formValue') formValue :  any;
  @Input() mode :  any;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator | any;
  @ViewChild(MatSort) sort: MatSort | any;
  dataSource: any = new MatTableDataSource<corporates>();
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
      this.updateForm();
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

  updateForm()
  {
    console.log(this.formValue.customers);
    this.dataSource = new MatTableDataSource(this.formValue.customers);
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
