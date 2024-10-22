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
    this.router.navigate(['manage/add-author']);
  }

  editAuthor(id: number): void {
    this.router.navigate([`manage/update-author/${id}`]);
  }

  removeAuthor(id: number): void {
    Swal.fire({
      icon: 'question',
      title: 'Delete',
      text: `Do you want to delete author with '${id}'?`,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: 'var(--color-danger)'
    }).then(result => {
      if (result.isConfirmed) {
        this.authorService.delete(id).subscribe(
          data => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Delete successfully',
              showConfirmButton: false,
              timer: 1000
            }).then(result => {
              this.getAllAuthors();
            });
          },
          error => {
            console.log(error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Delete fail',
              text: 'Something went wrong',
              showConfirmButton: false,
              timer: 1500
            });
          });
      }
    });
  }
}
