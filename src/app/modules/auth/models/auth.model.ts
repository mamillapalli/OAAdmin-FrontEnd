import {UserModel} from "./user.model";

export class AuthModel{
  authToken: string;
  jwt: string;
  refreshToken: string;
  expiresIn: Date;
  aRoles: [] | any;


  setAuth(auth: AuthModel) {
    this.authToken = auth.authToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
    this.jwt = auth.jwt;
    this.aRoles = auth.aRoles;
  }
}

