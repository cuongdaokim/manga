import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-accounts-page',
  templateUrl: './admin-accounts-page.component.html',
  styleUrls: ['./admin-accounts-page.component.scss']
})
export class AdminAccountsPageComponent implements OnInit {
  listAccounts: UserModel[] = [];
  listOrigin: UserModel[] = [];
  searchStr: string = '';
  pageIndex: number = 1;

  constructor(
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    this.getAllAccounts();
  }

  search(): void {
    if (this.searchStr) {
      this.listAccounts = this.listOrigin.filter(user => user.name.includes(this.searchStr));
    }
  }

  offSearch(): void {
    if (!this.searchStr) {
      this.listAccounts = this.listOrigin;
    }
  }

  getAllAccounts(): void {
    this.userService.getAll().subscribe(data => {
      this.listAccounts = data;
      this.listOrigin = this.listAccounts;
    });
  }

  addAccount(): void {
    this.router.navigate(['manage/add-account']);
  }

  editAccount(id: number): void {
    this.router.navigate([`manage/update-account/${id}`]);
  }

  lockAccount(account: UserModel): void {
    let choice = account.isDeleted ? 'Unlock' : 'Lock';
    Swal.fire({
      icon: 'question',
      title: choice,
      text: `Do you want ${choice.toLowerCase()} account has '${account.id}'?`,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonText: choice,
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: 'var(--color-danger)'
    }).then(result => {
      if (result.isConfirmed) {
        account.isDeleted = !account.isDeleted;
        this.userService.update(account).subscribe(data => console.log(data));
      }
    });
  }

  removeAccount(id: number): void {
    Swal.fire({
      icon: 'question',
      title: 'Delete',
      text: `Du you want Delete account with '${id}'?`,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: 'var(--color-danger)'
    }).then(result => {
      if (result.isConfirmed) {
        this.userService.delete(id).subscribe(
          data => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Delete successfully',
              showConfirmButton: false,
              timer: 1000
            }).then(result => {
              this.getAllAccounts();
            });
          },
          error => {
            console.log(error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Something went wrong',
              showConfirmButton: false,
              timer: 1500
            });
          });
      }
    });
  }
}
