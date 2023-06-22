import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-verifyviaotp',
  templateUrl: './verifyviaotp.component.html',
  styleUrls: ['./verifyviaotp.component.scss']
})
export class VerifyviaotpComponent {



otp:any='';
constructor(private service:ServiceService,private route:Router) { }
  otpVerify(){
    let email:any=localStorage.getItem('email');
    console.log(email);
    console.log(this.otp);

    const payload={
      otp:this.otp,
      email:email
    }

    this.service.verifyotpviamail(payload).subscribe((res:any)=>{
      console.log(res);
      alert(res.message);
      console.log(res.data);
      if(res.data==true){
        this.route.navigate(['/forgot',email,this.otp]);
      }
    })
    }

  }

