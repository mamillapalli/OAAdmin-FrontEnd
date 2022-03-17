import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Subscription } from 'rxjs';
import { superAdmin } from 'src/app/OAAdmin/Model/super-admin';
import { oaCommonService } from '../../../../../OAAdmin/shared/oacommon.service'

@Component({
  selector: 'app-profile-details',
  templateUrl: './profile-details.component.html',
})
export class ProfileDetailsComponent implements OnInit {
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];
  superAdminForm: FormGroup;
  @Input() defaultValues: Partial<superAdmin>;

  constructor(private cdr: ChangeDetectorRef,public oaCommonService: oaCommonService,private fb: FormBuilder) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
    this.superAdminForm = this.fb.group({
      userId: ['', [Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      effectiveDate: ['', [Validators.required]],
      expiryDate: ['', [Validators.required]],
      emailAddress: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getAccounts();
  }

  public getAccounts() {
    const sb = this.oaCommonService.getMethod('/oaadmin/api/v1/myprofile','MASTER').subscribe((res) => {
      console.log(res)
      this.superAdminForm.patchValue(res)
    });
    this.unsubscribe.push(sb);
  }

  saveSettings() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.cdr.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}

