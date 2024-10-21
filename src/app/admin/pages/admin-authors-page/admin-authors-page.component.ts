import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorModel } from 'src/app/models/author.model';
import { AuthorService } from 'src/app/services/author.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-authors-page',
  templateUrl: './admin-authors-page.component.html',
  styleUrls: ['./admin-authors-page.component.scss']
})
export class AdminAuthorsPageComponent implements OnInit {
  listAuthors: AuthorModel[] = [];
  listOrigin: AuthorModel[] = [];
  searchStr: string = '';
  pageIndex: number = 1;

  constructor(
    private authorService: AuthorService,
    private router: Router) { }

  ngOnInit(): void {
    this.getAllAuthors();
  }

  search(): void {
    if (this.searchStr) {
      this.listAuthors = this.listOrigin.filter(author => author.name.includes(this.searchStr));
    }
  }

  offSearch(): void {
    if (!this.searchStr) {
      this.listAuthors = this.listOrigin;
    }
  }

  getAllAuthors(): void {
    this.authorService.getAll().subscribe(data => {
      this.listAuthors = data;
      this.listOrigin = this.listAuthors;
    });
  }

  addAuthor(): void {
    this.router.navigate(['quan-tri/them-tac-gia']);
  }

  editAuthor(id: number): void {
    this.router.navigate([`quan-tri/cap-nhat-tac-gia/${id}`]);
  }

  removeAuthor(id: number): void {
    Swal.fire({
      icon: 'question',
      title: 'Xóa',
      text: `Bạn có chắc muốn xóa tác giả có mã '${id}'?`,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: 'var(--color-danger)'
    }).then(result => {
      if (result.isConfirmed) {
        this.authorService.delete(id).subscribe(
          data => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Xóa thành công!',
              showConfirmButton: false,
              timer: 1000
            }).then(result => {
              this.getAllAuthors();
            });
          },
          error => {
            console.log(error);
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Không thể xóa!',
              text: 'Có thể đang có truyện thuộc giả này tồn tại',
              showConfirmButton: false,
              timer: 1500
            });
          });
      }
    });
  }
}
