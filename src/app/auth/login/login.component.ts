import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup | any;
  message: string;
  public statusLogin : string | boolean = false;
  constructor(public authService: AuthService, public router: Router, private fb: FormBuilder) {
    this.message = this.getMessage();
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  getMessage() {
    return 'Logged ' + (this.authService.isLoggedIn ? 'in' : 'out');
  }

  onSubmit() {
    // this.message = 'Trying to log in ...';
    if (this.loginForm.valid) {
      
          this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
          .subscribe(() => {
            this.message = this.getMessage();
            if (this.authService.isLoggedIn) {
              this.statusLogin = false;
              const redirectUrl = '/product';
              const navigationExtras: NavigationExtras = {
                queryParamsHandling: 'preserve',
                preserveFragment: true
              };
              this.router.navigate([redirectUrl], navigationExtras);

            }else {
               this.statusLogin = 'Email hoặc mật khẩu không chính xác . ';
            }
          });
    }
    
   
  }

  logout() {
    this.authService.logout();
    this.message = this.getMessage();
  }
}

