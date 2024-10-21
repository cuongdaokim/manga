import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChapterModel } from 'src/app/models/chapter.model';
import { ComicModel } from 'src/app/models/comic.model';

@Component({
  selector: 'app-slide-comic-item',
  templateUrl: './slide-comic-item.component.html',
  styleUrls: ['./slide-comic-item.component.scss']
})
export class SlideComicItemComponent implements OnInit {
  @Input() comic: ComicModel = new ComicModel();
  newestChapter: ChapterModel = new ChapterModel();

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.comic = Object.assign(new ComicModel(), this.comic);
    this.newestChapter = Object.assign(
      new ChapterModel(),
      this.comic.chapters.sort((a, b) => b.chapterIndex - a.chapterIndex)[0]
    );
  }

  navigateToComicDetail(): void {
    this.router.navigate([`/truyen-tranh/${this.comic.id}`]);
  }

  navigateToChapter(index: number) {
    this.router.navigate([`/truyen-tranh/${this.comic.id}/chuong/${index}`]);
  }
}
