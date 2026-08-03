import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login';

@NgModule({
  imports: [
    CommonModule,
    LoginComponent 
  ]
})
export class AuthModule { }
