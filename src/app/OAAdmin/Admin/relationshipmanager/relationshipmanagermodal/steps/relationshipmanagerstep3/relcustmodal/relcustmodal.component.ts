import {Component, Input, OnInit} from '@angular/core';
import {Customer} from "../../../../../../Model/customer";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {ModalDismissReasons, NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {CustomerstablemodalComponent} from "../../../../../rm/rmmodal/rmsteps/rmstep3/customermodal/customerstablemodal/customerstablemodal.component";

@Component({
  selector: 'app-relcustmodal',
  templateUrl: './relcustmodal.component.html',
  styleUrls: ['./relcustmodal.component.scss']
})
export class RelcustmodalComponent implements OnInit {

  @Input() id: number;
  customer: Customer;
  form: FormGroup;
  private subscriptions: Subscription[] = [];
  private EMPTY_CUSTOMER: Customer;
  private closeResult: string;

  tabs = {
    BASIC_TAB: 0,
    REMARKS_TAB: 1,
  };
  activeTabId = this.tabs.BASIC_TAB; // 0 => Basic info | 1 => Remarks | 2 => Specifications

  constructor(
    private fb: FormBuilder, public modal: NgbActiveModal,public modalService: NgbModal,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      customerId: ['', []],
      name: ['', []],
      addressLine1: ['', []],
      addressLine2: ['', []],
      addressLine3: ['', []],
      poBox: ['', []],
      country: ['', []],
      emailAddress: ['', []],
      vatRegistrationNumber: ['', []],
      taxRegistrationNumber: ['', []],
      directorName: ['', []],
      directorDetails: ['', []],
      sponsorName: ['', []],
      effectiveDate: ['', []],
      expiryDate: ['', []],
      status: ['', []],
    });
  }


  save() {
    // if (!this.f.valid) {
    //   return;
    // }
    this.modal.close(this.customer);
  }

  openCustomer() {
    const modalRef = this.modalService.open(CustomerstablemodalComponent, { size: 'xl' });
    modalRef.result.then((result) => {
      this.updateForm(result);
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

  private updateForm(result: any) {
    this.f.customerId.setValue(result.customerId);
    this.f.name.setValue(result.name);
    this.f.addressLine1.setValue(result.addressLine1);
    this.f.addressLine2.setValue(result.addressLine2);
    this.f.addressLine3.setValue(result.addressLine3);
    this.f.poBox.setValue(result.poBox);
    this.f.country.setValue(result.country);
    this.f.emailAddress.setValue(result.emailAddress);
    this.f.vatRegistrationNumber.setValue(result.vatRegistrationNumber);
    this.f.taxRegistrationNumber.setValue(result.taxRegistrationNumber);
    this.f.directorName.setValue(result.directorName);
    this.f.directorDetails.setValue(result.directorDetails);
    this.f.sponsorName.setValue(result.sponsorName);
    this.f.status.setValue(result.status);
    this.f.expiryDate.setValue(result.expiryDate);
    this.f.effectiveDate.setValue(result.effectiveDate);
    this.customer = result;
  }

  get f() {
    return this.form.controls;
  }

  changeTab(tabId: number) {
    this.activeTabId = tabId;
  }

}
