import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GenreModel } from 'src/app/models/genre.model';
import { GenreService } from 'src/app/services/genre.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-add-genre-page',
  templateUrl: './admin-add-genre-page.component.html',
  styleUrls: ['./admin-add-genre-page.component.scss']
})
export class AdminAddGenrePageComponent implements OnInit {
  newGenre: GenreModel = new GenreModel();
  editId?: number;

  addForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required)
  });

  get name() { return this.addForm.get('name'); }

  constructor(
    private genreService: GenreService,
    private router: Router,
    private activeRoute: ActivatedRoute) { }

  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.genreService.getById(this.editId).subscribe(data => this.newGenre = data);
    }
  }

  goBack(): void {
    this.router.navigate(['manage/manage-genre']);
  }

  postGenre(): void {
    if (this.addForm.valid) {
      if (this.editId) {
        this.updateGenre();
      }
      else {
        this.addGenre();
      }
    }
    else {
      this.addForm.markAllAsTouched();
    }
  }

  addGenre(): void {
    this.genreService.add(this.newGenre).subscribe(
      data => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Add genre successfully',
          showConfirmButton: false,
          timer: 1000
        }).then(result => {
          this.goBack();
        });
      },
      error => {
        let message = 'Something went wrong';

        if (error.status === 304) {
          message = 'Genre already exist';
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

  updateGenre(): void {
    this.genreService.update(this.newGenre).subscribe(
      data => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Update genre successfully',
          showConfirmButton: false,
          timer: 1000
        }).then(result => {
          this.goBack();
        });
      },
      error => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Something went wrong',
          showConfirmButton: false,
          timer: 1500
        });
      });
  }
}
