import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OtpComponent } from './otp/otp.component';
import { FormComponent } from './form/form.component';
import { LoginComponent } from './login/login.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { EmailComponent } from './email/email.component';
import { VerifyviaotpComponent } from './verifyviaotp/verifyviaotp.component';
import { CoverComponent } from './cover/cover.component';

const routes: Routes = [{path:'otp',component:OtpComponent},
{path:'',component:CoverComponent},
{path:'form',component:FormComponent},
{path:'login',component:LoginComponent},
{path:'forgot',component:ForgotPasswordComponent},
{path:'forgot/:email/:otp',component:ForgotPasswordComponent},
{path:'email',component:EmailComponent},
{path:'verify/:email',component:VerifyviaotpComponent},
{path:'verify',component:VerifyviaotpComponent},
{path:'new',loadChildren: () => import('./main/main.module').then(m => m.MainModule )}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
