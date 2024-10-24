import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChapterModel } from 'src/app/models/chapter.model';
import { ComicModel } from 'src/app/models/comic.model';
import {
  fadeInRightOnEnterAnimation,
 fadeOutLeftOnLeaveAnimation
} from "angular-animations";

@Component({
  selector: 'app-main-comic-item',
  templateUrl: './main-comic-item.component.html',
  styleUrls: ['./main-comic-item.component.scss'],
  animations: [
    fadeOutLeftOnLeaveAnimation(),
    fadeInRightOnEnterAnimation()
  ]
})
export class MainComicItemComponent implements OnInit {
  @Input() comic: ComicModel = new ComicModel();
  listChapters: ChapterModel[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.comic = Object.assign(new ComicModel(), this.comic);
    this.listChapters = this.comic.chapters
      .sort((a, b) => b.chapterIndex - a.chapterIndex)
      .slice(0, 3)
      .map(chapter => Object.assign(new ChapterModel(), chapter));
  }

  navigateToComicDetail(): void {
    this.router.navigate([`/manga/${this.comic.id}`]);
  }

  navigateToChapter(index: number) {
    this.router.navigate([`/manga/${this.comic.id}/chapter/${index}`]);
  }
}
