import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormComponent } from './form/form.component';
import { OtpComponent } from './otp/otp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ServiceService } from './service.service';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

import { PasswordModule } from 'primeng/password';
import { EmailComponent } from './email/email.component';
import { VerifyviaotpComponent } from './verifyviaotp/verifyviaotp.component';
import { ButtonModule } from 'primeng/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CoverComponent } from './cover/cover.component';

@NgModule({
  
  declarations: [
    AppComponent,
    FormComponent,
    OtpComponent,
    LoginComponent,
    ForgotPasswordComponent,
    EmailComponent,
    VerifyviaotpComponent,
    CoverComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,HttpClientModule,FormsModule,PasswordModule,ButtonModule,BrowserAnimationsModule,ToastModule,ReactiveFormsModule
  ],
  providers: [ServiceService,MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
