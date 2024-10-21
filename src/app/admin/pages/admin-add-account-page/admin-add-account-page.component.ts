import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoleType, UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-add-account-page',
  templateUrl: './admin-add-account-page.component.html',
  styleUrls: ['./admin-add-account-page.component.scss']
})
export class AdminAddAccountPageComponent implements OnInit {
  newAccount: UserModel = new UserModel();
  retypePass: string = '';
  editId?: number;

  selectedRole: RoleType = RoleType.USER;

  roleOptions = [
    { value: RoleType.ADMIN, text: 'Quản trị viên' },
    { value: RoleType.USER, text: 'Người dùng' },
  ];

  addForm: FormGroup = new FormGroup({
    name: new FormControl(this.newAccount.name, Validators.required),
    email: new FormControl(this.newAccount.email, [Validators.required, Validators.email]),
    pass: new FormControl(this.newAccount.pass, Validators.required),
    repass: new FormControl(this.retypePass, Validators.required),
    role: new FormControl(this.selectedRole)
  });

  get name() { return this.addForm.get('name'); }
  get email() { return this.addForm.get('email'); }
  get pass() { return this.addForm.get('pass'); }
  get repass() { return this.addForm.get('repass'); }

  constructor(
    private userService: UserService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.userService.getById(this.editId).subscribe(data => {
        this.newAccount = data;
        this.retypePass = this.newAccount.pass;
        this.selectedRole = +RoleType[this.newAccount.role];
      });
    }
  }

  goBack(): void {
    this.router.navigate(['quan-tri/quan-ly-tai-khoan']);
  }

  postAccount(): void {
    if (this.addForm.valid) {
      this.newAccount.role = this.selectedRole;

      if (this.editId) {
        this.updateAccount();
      }
      else {
        this.addAccount();
      }
    }
    else {
      this.addForm.markAllAsTouched();
    }
  }

  addAccount(): void {
    if (this.newAccount.pass !== this.retypePass) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Mật khẩu nhập lại không chính xác',
        showConfirmButton: false,
        timer: 1500
      });

      return;
    }

    this.userService.add(this.newAccount).subscribe(
      data => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Thêm tài khoản thành công!',
          showConfirmButton: false,
          timer: 1000
        }).then(result => {
          this.goBack();
        });
      },
      error => {
        let message = 'Có lỗi xảy ra!';

        if (error.status === 304) {
          message = 'Email đã được sử dụng!';
        }

        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: message,
          showConfirmButton: false,
          timer: 1500
        });
      });
  }

  updateAccount(): void {
    this.userService.update(this.newAccount).subscribe(
      data => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cập nhật tài khoản thành công!',
          showConfirmButton: false,
          timer: 1000
        }).then(result => {
          this.goBack();
        });
      },
      error => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Có lỗi xảy ra!',
          showConfirmButton: false,
          timer: 1500
        });
      });
  }
}
