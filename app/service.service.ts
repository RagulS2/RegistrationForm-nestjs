import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) {}

    signup(body:any){
      return this.http.post('http://localhost:3000/user/signup',body);
    }
    verifyotp(payload:any){
      return this.http.post('http://localhost:3000/user/verifyotp',payload);
    }

    login(body:any){
      return this.http.post('http://localhost:3000/user/login',body);
    }
    forgotPassword(payload:any){
      return this.http.post('http://localhost:3000/user/forgotPassword',payload);
    }
    checkEmail(email:any){
      return this.http.post('http://localhost:3000/user/resendotp',{email});
    }
    verifyotpviamail(payload:any){
      return this.http.post('http://localhost:3000/user/verifyotpviamail',payload);
    }
   }
