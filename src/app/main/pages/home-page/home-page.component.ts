import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { lastValueFrom } from 'rxjs';
import { ComicModel } from 'src/app/models/comic.model';
import { GenreModel } from 'src/app/models/genre.model';
import { HistoryModel } from 'src/app/models/history.model';
import { ComicService } from 'src/app/services/comic.service';
import { GenreService } from 'src/app/services/genre.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {
  listComics: ComicModel[] = [];
  listRecommends: ComicModel[] = [];
  listGenres: GenreModel[] = [];
  listHistories: ComicModel[] = [];
  historyJson: HistoryModel[] | undefined;

  pageIndex: number = 1;

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    autoplay: true,
    autoWidth: true,
    pullDrag: false,
    dots: false,
    center: true,
    navSpeed: 600,
    navText: ['&#8249', '&#8250;'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      600: {
        items: 3
      },
      800: {
        items: 4
      },
      1000: {
        items: 5
      },
      1200: {
        items: 6
      }
    },
    nav: true,

  }

  constructor(
    private router: Router,
    private comicService: ComicService,
    private genreService: GenreService
  ) { }

  ngOnInit(): void {
    this.comicService.getAllPublishedOrderByTime().subscribe(data => {
      this.listComics = data;
      this.listRecommends.push(...this.listComics);
      this.listRecommends = this.listRecommends.sort((a, b) => b.view - a.view).slice(0, 6);
    });

    this.genreService.getAll().subscribe(data => {
      this.listGenres = data;
    });

    this.getListHistories();
  }

  getListHistories(): void {
    const historyItems = localStorage.getItem('history');

    if (historyItems) {
      this.historyJson = JSON.parse(historyItems);
      if (this.historyJson) {
        this.historyJson.forEach(async (item: HistoryModel) => {
          let comic = await lastValueFrom(this.comicService.getById(item.comicId));
          comic.continueChapterIndex = item.chapterIndex;
          this.listHistories.push(comic);
        });
      }
    }
  }

  deleteHistoryItem(index: number): void {
    this.listHistories.splice(index, 1);
    if (this.historyJson) {
      this.historyJson?.splice(index, 1);

      localStorage.setItem('history', JSON.stringify(this.historyJson));
    }
  }

  searchByGenre(id: number) {
    this.router.navigate([`/tim-kiem/the-loai/${id}`]).then(() => window.location.reload());
  }
}
