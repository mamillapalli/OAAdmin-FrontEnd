import {ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import {BehaviorSubject, Subscription} from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { csuperAdmin } from 'src/app/OAAdmin/Model/OAAdmin/CRequest/csuper-admin';
import {superAdmin} from 'src/app/OAAdmin/Model/super-admin';
import Swal from 'sweetalert2';
import {oaCommonService} from '../../../../../OAAdmin/shared/oacommon.service'

class ImageSnippet {
  constructor(public src: string, public file: File) {
  }
}

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
  selectedFile: any;
  file: any;
  @ViewChild('formFile')  myInputVariable: ElementRef;
  imageToShow: any;
  authRoles: any;
  cSuperAdmin: csuperAdmin;

  constructor(public authService: AuthService,public oaCommonService: oaCommonService,
              private fb: FormBuilder,private sanitizer: DomSanitizer) {
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
    this.loadImageFile();
    const auth = this.authService.getAuthFromLocalStorage();
    this.authRoles = auth?.aRoles
    console.log(this.authRoles)
  }

  ngOnInit(): void {
    this.getAccounts();
  }


  loadImageFile() {
    const sb = this.oaCommonService.getProfilePic('/oaadmin/api/v1/getProfilePic').subscribe((res) => {
      this.isImageLoading = true;
      const unsafeImageUrl = URL.createObjectURL(res);
      this.imageToShow = this.sanitizer.bypassSecurityTrustUrl(unsafeImageUrl);
      //this.createImageFromBlob(res);
      this.isImageLoading = false;
    });
  }


  isImageLoading: boolean;

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener( "progress", () => {
      this.imageToShow = reader.result;
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  public getAccounts() {
    const sb = this.oaCommonService.getMethod('/oaadmin/api/v1/myprofile', 'MASTER').subscribe((res) => {
      console.log(res)
      this.superAdminForm.patchValue(res)
    });
    this.unsubscribe.push(sb);
  }

  saveSettings() {
    this.cSuperAdmin = new csuperAdmin(this.superAdminForm.value);
    console.log(this.cSuperAdmin)
    const dataPost = JSON.stringify(this.cSuperAdmin);
    console.log(dataPost)
    if(this.authRoles === "SUPER_ADMIN")
    {
      this.oaCommonService.dataItem(this.cSuperAdmin,this.cSuperAdmin.userId,'edit','oaadmin/api/v1/superadmins').subscribe(res => {
        console.log('Response is : ' + res)
        if (res !== undefined && res !== '') {
          Swal.fire({
            title: 'Edit Record Successfully',
            icon: 'success'
          }).then((result: any) => {
            console.log(result)
            if (result.value) {
              Swal.close();
            }
          });
        } else {
          Swal.fire({
            title: 'Error is occurred.',
            icon: 'error'
          });
        }
      }, (error: { message: any }) => {
        console.error('There was an error!', error);
        return;
      });
    } else {
      this.oaCommonService.dataItem(this.cSuperAdmin,this.cSuperAdmin.userId,'edit','oaadmin/api/v1/superadmins').subscribe(res => {
        console.log('Response is : ' + res)
        if (res !== undefined && res !== '') {
          Swal.fire({
            title: 'Edit Record Successfully',
            icon: 'success'
          }).then((result:any) => {
            console.log(result)
            if (result.value) {
              Swal.close();
            }
          });
        } else {
          Swal.fire({
            title: 'Error is occurred.',
            icon: 'error'
          });
        }
      }, (error: { message: any }) => {
        console.error('There was an error!', error);
        return;
      });
    }
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }


  processFile(imageInput: any) {
    const file: File = imageInput.files[0];
    const reader = new FileReader();
    console.log('process file ');
    reader.addEventListener("loadend", (event: any) => {

      this.selectedFile = new ImageSnippet(event.target.result, file);
      console.log('process file '+ this.selectedFile);
      this.oaCommonService.uploadImage(this.selectedFile.file,'').subscribe((res: any) => {
        console.log(res)
        if (res !== null) {
          let status = res
          Swal.fire({
            title: 'File Status is ' + res.fileStatus,
            icon: 'success'
          });
        } else {
          Swal.fire({
            title: 'Error is occurred.' + res,
            icon: 'error'
          });
        }
      }, (error: { message: any }) => {
        console.error('There was an error!', error);
        Swal.fire({
          title: 'Error is occurred.' + error,
          icon: 'error'
        });
        return;
      });
    });
  }

  onFilechange(event: any) {
    console.log(event.target.files[0])
    this.file = event.target.files[0]
  }

  upload() {
    if (this.file) {
      this.oaCommonService.uploadImage(this.file, this.f.userId.value).subscribe((res: any) => {
        console.log(res)
        if (res !== null) {
          let status = res
          Swal.fire({
            title: 'File Status is ' + res.fileId,
            icon: 'success'
          });
          console.log('after sucess ')
          this.loadImageFile();
          console.log(this.myInputVariable.nativeElement.files);
          this.myInputVariable.nativeElement.value = "";
          console.log(this.myInputVariable.nativeElement.files);
        } else {
          Swal.fire({
            title: 'Error is occurred.' + res,
            icon: 'error'
          });
        }
      }, (error: { message: any }) => {
        console.error('There was an error!', error);
        Swal.fire({
          title: 'Error is occurred.' + error,
          icon: 'error'
        });
        return;
      });
    } else {
      alert("Please select a file first")
    }
  }

  get f() {
    return this.superAdminForm.controls;
  }

}

