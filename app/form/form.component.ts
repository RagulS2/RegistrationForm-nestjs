import { Component } from '@angular/core';
import { ServiceService } from '../service.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {

constructor(private service:ServiceService,private route:Router) { }

userForm:FormGroup=new FormGroup({
  userName:new FormControl('',{validators:[Validators.required,Validators.minLength(3),Validators.pattern('[a-zA-Z ]*')]}),
  email:new FormControl('',{validators:[Validators.required,Validators.email, Validators.pattern('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}')]}),
  password:new FormControl('',{validators:[Validators.required,Validators.minLength(6),Validators.maxLength(20)]}),
});

  signup(){
  this.service.signup(this.userForm.value).subscribe((res:any)=>{
    console.log(res);
    localStorage.setItem('email',this.userForm.controls['email'].value);
    this.route.navigate(['/otp']);

  })
  }
}
