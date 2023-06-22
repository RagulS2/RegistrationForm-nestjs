import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent {
  constructor( private service:ServiceService,private route:Router) {}

    email:string='';

    checkEmail(){
      
      this.service.checkEmail(this.email).subscribe((res:any)=>{
        localStorage.setItem('email',this.email);
        console.log(res);
        this.route.navigate(['/verify']);
      })
    }
  

}
