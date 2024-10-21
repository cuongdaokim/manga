import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { MainComponent } from '../../main.component';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  loginUser: UserModel = new UserModel();

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    pass: new FormControl('', Validators.required)
  });

  get email() { return this.loginForm.get('email'); }
  get pass() { return this.loginForm.get('pass'); }

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.userService.login(this.loginUser).subscribe(
      data => {
        localStorage.setItem('authorizeToken', data.id + '');

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Login thành công!',
          showConfirmButton: false,
          timer: 1500
        }).then(result => {
          MainComponent.currentUser = data;
          this.router.navigate(['']).then(() => window.location.reload());
        });
      },
      error => {
        if (error.status == 404) {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Email hoặc mật khẩu không đúng!',
            showConfirmButton: false,
            timer: 1500
          });
        }
        else if (error.status == 406) {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Account đã bị khóa!',
            showConfirmButton: false,
            timer: 1500
          });
        }
        else {
          console.log(error);
        }
      }
    )
  }
}
