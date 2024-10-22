import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthorModel } from 'src/app/models/author.model';
import { AuthorService } from 'src/app/services/author.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-add-author-page',
  templateUrl: './admin-add-author-page.component.html',
  styleUrls: ['./admin-add-author-page.component.scss']
})
export class AdminAddAuthorPageComponent implements OnInit {
  newAuthor: AuthorModel = new AuthorModel();
  editId?: number;

  addForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  get name() { return this.addForm.get('name'); }

  constructor(
    private authorService: AuthorService,
    private router: Router,
    private activeRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.authorService.getById(this.editId).subscribe(data => this.newAuthor = data);
    }
  }

  goBack(): void {
    this.router.navigate(['manage/manage-author']);
  }

  postAuthor(): void {
    if (this.addForm.valid) {
      if (this.editId) {
        this.updateAuthor();
      }
      else {
        this.addAuthor();
      }
    }
    else {
      this.addForm.markAllAsTouched();
    }
  }

  addAuthor(): void {
    this.authorService.add(this.newAuthor).subscribe(
      data => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Thêm tác giả thành công!',
          showConfirmButton: false,
          timer: 1000
        }).then(result => {
          this.goBack();
        });
      },
      error => {
        let message = 'Có lỗi xảy ra!';

        if (error.status === 304) {
          message = 'Author đã tồn tại!';
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

  updateAuthor(): void {
    this.authorService.update(this.newAuthor).subscribe(
      data => {
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Cập nhật tác giả thành công!',
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
