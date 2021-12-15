import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import {AuthModel} from "../../../../../modules/auth/models/auth.model";
import {of} from "rxjs";

@Component({
  selector: 'app-aside-menu',
  templateUrl: './aside-menu.component.html',
  styleUrls: ['./aside-menu.component.scss'],
})
export class AsideMenuComponent implements OnInit {
  appAngularVersion: string = environment.appVersion;
  appPreviewChangelogUrl: string = environment.appPreviewChangelogUrl;
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  authRoles : any
  constructor() {}

  ngOnInit(): void {
    const auth = this.getAuthFromLocalStorage();
    console.log(auth?.aRoles)
    this.authRoles = auth?.aRoles
  }

  public getAuthFromLocalStorage(): AuthModel | undefined {
    try {
      const lsValue = localStorage.getItem(this.authLocalStorageToken);
      if (!lsValue) {
        return undefined;
      }

      const authData = JSON.parse(lsValue);
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}
