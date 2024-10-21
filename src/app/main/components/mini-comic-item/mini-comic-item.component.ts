import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ComicModel } from 'src/app/models/comic.model';
import { HistoryModel } from 'src/app/models/history.model';

@Component({
  selector: 'app-mini-comic-item',
  templateUrl: './mini-comic-item.component.html',
  styleUrls: ['./mini-comic-item.component.scss']
})
export class MiniComicItemComponent implements OnInit {
  @Input() comic: ComicModel = new ComicModel();
  @Input() index: number = -1;
  @Output() onDelete: EventEmitter<number> = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.comic = Object.assign(new ComicModel(), this.comic);
  }

  navigateToComicDetail(): void {
    this.router.navigate([`/truyen-tranh/${this.comic.id}`]);
  }

  navigateToChapter(index: number): void {
    this.router.navigate([`/truyen-tranh/${this.comic.id}/chuong/${index}`]);
  }

  deleteItem(): void {
    this.onDelete.emit(this.index);
  }
}
