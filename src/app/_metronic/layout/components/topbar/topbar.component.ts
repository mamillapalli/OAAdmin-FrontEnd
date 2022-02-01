import {Component, OnInit} from '@angular/core';
import {LayoutService} from '../../core/layout.service';
import {DomSanitizer} from '@angular/platform-browser';
import {oaCommonService} from '../../../../OAAdmin/shared/oacommon.service'

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  thumbnail: any;

  constructor(private layout: LayoutService, private sanitizer: DomSanitizer, public oaCommonService: oaCommonService) {
  }

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
    console.log('profile pic')
    const sb = this.oaCommonService.getProfilePic('oaadmin/api/v1/getProfilePic').subscribe((res) => {
      console.log(res)
      this.createImageFromBlob(res);
      this.thumbnail = this.sanitizer.bypassSecurityTrustUrl(this.imageToShow);
    });
  }

  imageToShow: any;
  isImageLoading: boolean;

  createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

}
