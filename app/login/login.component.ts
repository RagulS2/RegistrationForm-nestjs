import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginForm:FormGroup=new FormGroup({
    email:new FormControl('',{validators:[Validators.required,Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]}),
  password:new FormControl('',{validators:[Validators.required,Validators.minLength(6),Validators.maxLength(20)]}),
});
  
  constructor(private service: ServiceService, private route: Router, private messageService: MessageService) { }

  login() {
    this.service.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        console.log(res);
        this.show(res.message);
        // alert(res.message);
        this.route.navigate(['/new']);
      }, error: (err: HttpErrorResponse) => {
        console.log(err);
        this.errorShow(err.error.message)
      }
    })

}
  show(message:string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  errorShow(message:string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

}
