import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import {slideInLeftOnEnterAnimation, slideInRightOnEnterAnimation, slideInUpOnEnterAnimation} from "angular-animations";

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
  animations: [
    slideInRightOnEnterAnimation(),
  ]
})
export class SignupPageComponent implements OnInit {
  newUser: UserModel = new UserModel();
  retypePass: string = "";

  signUpForm: FormGroup = new FormGroup({
    name: new FormControl(this.newUser.name, Validators.required),
    email: new FormControl(this.newUser.email, [Validators.required, Validators.email]),
    pass: new FormControl(this.newUser.pass, Validators.required),
    repass: new FormControl(this.retypePass, Validators.required)
  });

  get name() { return this.signUpForm.get('name'); }
  get email() { return this.signUpForm.get('email'); }
  get pass() { return this.signUpForm.get('pass'); }
  get repass() { return this.signUpForm.get('repass'); }

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  onRegister(): void {
    if (this.signUpForm.invalid) {
      return;
    }

    if (this.newUser.pass !== this.retypePass) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Password incorrect',
        showConfirmButton: false,
        timer: 1500
      });

      return;
    }

    this.userService.add(this.newUser).subscribe(
      data => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Register successfully',
          showConfirmButton: false,
          timer: 1000
        }).then(result => {
          this.router.navigateByUrl('/login');
        });
      },
      error => {
        let message = 'Something went wrong';

        if (error.status === 304) {
          message = 'Email already exists';
        }

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 1500
        });
      });
  }
}
