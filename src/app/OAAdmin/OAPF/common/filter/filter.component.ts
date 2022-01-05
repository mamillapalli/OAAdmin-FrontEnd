import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  filterForm: FormGroup;
  @Input() fDisplayedColumns: any;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    console.log(this.fDisplayedColumns)
    this.filterForm = this.fb.group({
      filterOption: this.fb.array([this.newFilterOption()])
    });
  }

  getFilterValue(check: any) {
    if (check === 'Yes') {
      this.activeModal.close(this.filterForm)
    } else {
      this.activeModal.dismiss()
    }
  }

  newFilterOption(): FormGroup {
    return this.fb.group({
      filterId: '',
      filterValue: '',
    })
  }

  addFilterOption() {
    this.filterOption().push(this.newFilterOption());
  }

  filterOption(): FormArray {
    return this.filterForm.get("filterOption") as FormArray
  }

  removeFilter(i: any) {
    const fil = this.filterForm.get('filterOption') as FormArray
    if (fil.length > 1) {
      this.filterOption().removeAt(i);
    } else {
      this.filterOption().reset()
    }

  }
}
