import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GenreModel } from 'src/app/models/genre.model';
import { GenreService } from 'src/app/services/genre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-genres-page',
  templateUrl: './admin-genres-page.component.html',
  styleUrls: ['./admin-genres-page.component.scss']
})
export class AdminGenresPageComponent implements OnInit {
  listGenres: GenreModel[] = [];
  listOrigin: GenreModel[] = [];
  searchStr: string = '';
  pageIndex: number = 1;

  constructor(
    private router: Router,
    private genreService: GenreService) { }

  ngOnInit(): void {
    this.getAllGenres();
  }

  search(): void {
    if (this.searchStr) {
      this.listGenres = this.listOrigin.filter(genre => genre.name.includes(this.searchStr));
    }
  }

  offSearch(): void {
    if (!this.searchStr) {
      this.listGenres = this.listOrigin;
    }
  }

  getAllGenres(): void {
    this.genreService.getAll().subscribe(data => {
      this.listGenres = data;
      this.listOrigin = this.listGenres;
    });
  }

  addGenre(): void {
    this.router.navigate(['quan-tri/them-the-loai']);
  }

  editGenre(id: number): void {
    this.router.navigate([`quan-tri/cap-nhat-the-loai/${id}`]);
  }

  removeGenre(id: number): void {
    Swal.fire({
      icon: 'question',
      title: 'Xóa',
      text: `Bạn có chắc muốn xóa thể loại có mã '${id}'?`,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: 'var(--color-danger)'
    }).then(result => {
      if (result.isConfirmed) {
        this.genreService.delete(id).subscribe(
          data => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Xóa thành công!',
              showConfirmButton: false,
              timer: 1000
            }).then(result => {
              this.getAllGenres();
            });
          },
          error => {
            console.log(error);
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Không thể xóa!',
              text: 'Có thể đang có truyện thuộc thể loại này tồn tại',
              showConfirmButton: false,
              timer: 1500
            });
          });
      }
    });
  }
}
