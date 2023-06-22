import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

password:string='';


constructor(private service:ServiceService,private route:Router,private router:ActivatedRoute) { }


sendResetPasswordEmail(){
  let email=this.router.snapshot.paramMap.get('email');
  let otp=this.router.snapshot.paramMap.get('otp');

 const payload={
    email:email,
    password:this.password,
    otp:otp
  }
  console.log(payload);
  this.service.forgotPassword(payload).subscribe((res:any)=>{

   
    console.log(res);
    alert(res.message);
    this.route.navigate(['/login']);
  })


}
}
