import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComicModel } from 'src/app/models/comic.model';
import { GenreModel } from 'src/app/models/genre.model';
import { ComicService } from 'src/app/services/comic.service';
import { GenreService } from 'src/app/services/genre.service';
import {AuthorService} from "../../../services/author.service";
import {AuthorModel} from "../../../models/author.model";
import {
  fadeInOnEnterAnimation,
  fadeInRightOnEnterAnimation,
  fadeOutOnLeaveAnimation,
  flipOnEnterAnimation
} from "angular-animations";

@Component({
  selector: 'app-search-result-page',
  templateUrl: './search-result-page.component.html',
  styleUrls: ['./search-result-page.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
    fadeOutOnLeaveAnimation(),
    fadeInRightOnEnterAnimation()
  ]

})
export class SearchResultPageComponent implements OnInit {
  listComics: ComicModel[] = [];
  listGenres: GenreModel[] = [];
  listAuthors: AuthorModel[] = [];
  genreData?: GenreModel;
 authorData?: AuthorModel;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private comicService: ComicService,
    private genreService: GenreService,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {
    const searchStr = this.activeRoute.snapshot.paramMap.get('keyword');
    const genreId = this.activeRoute.snapshot.paramMap.get('genreId');
    const authorId = this.activeRoute.snapshot.paramMap.get('authorId');

    if (searchStr) {
      this.comicService.getByTitleOrderByTime(searchStr).subscribe(data => {
        this.listComics = data;
        this.listComics = this.listComics.map(comic => Object.assign(new ComicModel(), comic));
      });
    }
    else if (genreId) {
      this.comicService.getByGenreIdOrderByTime(+genreId).subscribe(data => {
        this.listComics = data;
        this.listComics = this.listComics.map(comic => Object.assign(new ComicModel(), comic));
      });
    }

    this.genreService.getAll().subscribe(data => {
      this.listGenres = data;
      if (genreId) {
        this.listGenres.forEach(genre => {
          if (genre.id == +genreId) {
            this.genreData = genre;
            return;
          }
        });
      }
    });

    this.authorService.getAll().subscribe(data => {
      this.listAuthors = data;
      if (authorId) {
        this.listGenres.forEach(author => {
          if (author.id == +authorId) {
            this.authorData = author;
            return;
          }
        });
      }
    });
  }

  getRandomColor(): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F39C12', '#8E44AD', '#16A085', '#2980B9'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  searchByGenre(id: number) {
    this.router.navigate([`/tim-kiem/the-loai/${id}`]).then(() => window.location.reload());
  }

  searchByAuthor(id: number) {
    this.router.navigate([`/tim-kiem/the-loai/${id}`]).then(() => window.location.reload());
  }
}
