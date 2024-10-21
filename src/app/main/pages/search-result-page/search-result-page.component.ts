import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComicModel } from 'src/app/models/comic.model';
import { GenreModel } from 'src/app/models/genre.model';
import { ComicService } from 'src/app/services/comic.service';
import { GenreService } from 'src/app/services/genre.service';

@Component({
  selector: 'app-search-result-page',
  templateUrl: './search-result-page.component.html',
  styleUrls: ['./search-result-page.component.scss']
})
export class SearchResultPageComponent implements OnInit {
  listComics: ComicModel[] = [];
  listGenres: GenreModel[] = [];
  genreData?: GenreModel;

  constructor(
    private activeRoute: ActivatedRoute,
    private router: Router,
    private comicService: ComicService,
    private genreService: GenreService
  ) { }

  ngOnInit(): void {
    const searchStr = this.activeRoute.snapshot.paramMap.get('keyword');
    const genreId = this.activeRoute.snapshot.paramMap.get('genreId');

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
  }

  searchByGenre(id: number) {
    this.router.navigate([`/tim-kiem/the-loai/${id}`]).then(() => window.location.reload());
  }
}
