import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";


@Component({
  selector: 'app-credit-advise',
  templateUrl: './credit-advise.component.html',
  styleUrls: ['./credit-advise.component.scss']
})
export class CreditAdviseComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal,) { }

  ngOnInit(): void {
  }

  closeModal() {
    console.log('close modal');
    this.activeModal.dismiss();
  }

  onPrint() {
    window.print();
  }
}
