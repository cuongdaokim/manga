import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterModel } from 'src/app/models/chapter.model';
import { ComicModel } from 'src/app/models/comic.model';
import { CommentModel } from 'src/app/models/comment.model';
import { ContentModel } from 'src/app/models/content.model';
import { HistoryModel } from 'src/app/models/history.model';
import { UserModel } from 'src/app/models/user.model';
import { ComicService } from 'src/app/services/comic.service';
import { CommentService } from 'src/app/services/comment.service';
import { ContentService } from 'src/app/services/content.service';
import { UserService } from 'src/app/services/user.service';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-comic-chapter-page',
  templateUrl: './comic-chapter-page.component.html',
  styleUrls: ['./comic-chapter-page.component.scss']
})
export class ComicChapterPageComponent implements OnInit {
  comicData: ComicModel = new ComicModel();
  chapterData: ChapterModel = new ChapterModel();
  userData?: UserModel;
  listContents: ContentModel[] = [];
  listComments: CommentModel[] = [];
  updatedTime: string = '';
  histories: HistoryModel[] = [];

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private elementRef: ElementRef,
    private comicService: ComicService,
    private contentService: ContentService,
    private userService: UserService,
    private commentService: CommentService
  ) { }

  ngOnInit(): void {
    window.onscroll = () => this.scrollFunction();

    const comicId = this.activeRoute.snapshot.paramMap.get('id');
    const chapterIndex = this.activeRoute.snapshot.paramMap.get('chapterId');
    const userId = localStorage.getItem('authorizeToken');

    if (userId) {
      this.userService.getById(+userId).subscribe(data => this.userData = data);
    }

    if (comicId && chapterIndex) {
      this.comicService.getById(+comicId).subscribe(data => {
        this.comicData = data;
        this.comicData.chapters = this.comicData.chapters
          .sort((a, b) => b.chapterIndex - a.chapterIndex)
          .map(chapter => Object.assign(new ChapterModel(), chapter));

        this.comicData.chapters.forEach(chapter => {
          if (chapter.chapterIndex == +chapterIndex) {
            this.chapterData = chapter;
          }
        });

        this.contentService.getByChapterId(this.chapterData.id).subscribe(data => {
          this.listContents = data;
          this.listContents = this.listContents.map(content => Object.assign(new ContentModel(), content));
        });

        this.commentService.getByChapterId(this.chapterData.id).subscribe(data => {
          this.listComments = data;
          this.listComments = this.listComments.sort().map(comment => Object.assign(new CommentModel(), comment));
        });

        this.updatedTime = Utils.getUpdatedDateTime(this.chapterData.createdTime);

        this.comicData.view++;
        this.comicService.update(this.comicData).subscribe();

        this.updateHistory(+comicId, +chapterIndex);
      });
    }
    else {
      this.router.navigate(['']);
    }
  }

  updateHistory(comicId: number, chapterIndex: number) {
    const historyItems = localStorage.getItem('history');

    if (historyItems) {
      const historyJson = JSON.parse(historyItems);
      if (historyJson) {
        this.histories.push(...historyJson);
      }
    }

    this.histories.forEach((item, index) => {
      if (item.comicId == comicId) {
        this.histories.splice(index, 1);
      }
    });

    let item = new HistoryModel();
    item.comicId = comicId;
    item.chapterIndex = chapterIndex;
    this.histories.unshift(item);

    if (this.histories.length > 5) {
      this.histories.splice(0, 1);
    }

    localStorage.setItem('history', JSON.stringify(this.histories));
  }

  nextChapter() {
    let currentIndex = this.comicData.chapters.indexOf(this.chapterData);
    const index = this.comicData.chapters[--currentIndex].chapterIndex;
    this.router
      .navigate([`../../chuong/${index}`], { relativeTo: this.activeRoute })
      .then(() => window.location.reload());;
  }

  previousChapter() {
    let currentIndex = this.comicData.chapters.indexOf(this.chapterData);
    const index = this.comicData.chapters[++currentIndex].chapterIndex;
    this.router
      .navigate([`../../chuong/${index}`], { relativeTo: this.activeRoute })
      .then(() => window.location.reload());;
  }

  navigateToChapterForSelect(event: any) {
    this.router
      .navigate([`../../chuong/${event.target.value}`], { relativeTo: this.activeRoute })
      .then(() => window.location.reload());
  }

  scrollFunction(): void {
    const topButton = this.elementRef.nativeElement.querySelector('.top-button') as HTMLElement;
    if (document.documentElement.scrollTop > 300) {
      topButton.style.display = "block";
    } else {
      topButton.style.display = "none";
    }
  }

  topFunction(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onCommentPosted(comment: CommentModel) {
    this.listComments.unshift(Object.assign(new CommentModel(), comment));
  }
}
