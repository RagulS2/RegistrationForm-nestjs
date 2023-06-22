import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { ActivatedRoute, Router } from '@angular/router';
interface Data{
  otp:any;
}
@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent {
constructor(private service:ServiceService,private route:Router) { }
body:Data={ 
  otp:''
}
  otp(){
    let email:any=localStorage.getItem('email');
    console.log(email);
    console.log(this.body.otp);

    const payload={
      otp:this.body.otp,
      email:email
    }

    this.service.verifyotp(payload).subscribe((res:any)=>{

      console.log(res);
      this.route.navigate(['/login']);
    })
    }
  }


