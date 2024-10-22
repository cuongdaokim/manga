import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChapterModel } from 'src/app/models/chapter.model';
import { ComicModel } from 'src/app/models/comic.model';
import { CommentModel } from 'src/app/models/comment.model';
import { ReviewModel, ReviewType } from 'src/app/models/review.model';
import { ComicService } from 'src/app/services/comic.service';
import { CommentService } from 'src/app/services/comment.service';
import { ReviewService } from 'src/app/services/review.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';
import { MainComponent } from '../../main.component';
import {
  fadeInRightOnEnterAnimation,
  slideInDownOnEnterAnimation,
  slideInLeftOnEnterAnimation,
  slideInRightOnEnterAnimation, slideInUpOnEnterAnimation
} from "angular-animations";

@Component({
  selector: 'app-comic-detail-page',
  templateUrl: './comic-detail-page.component.html',
  styleUrls: ['./comic-detail-page.component.scss'],
  animations: [slideInRightOnEnterAnimation(), slideInLeftOnEnterAnimation(), slideInDownOnEnterAnimation(), slideInUpOnEnterAnimation(), fadeInRightOnEnterAnimation()]
})
export class ComicDetailPageComponent implements OnInit {
  comic: ComicModel = new ComicModel();
  listComics: ComicModel[] = [];
  listRecommends: ComicModel[] = [];
  listChapters: ChapterModel[] = [];
  listComments: CommentModel[] = [];
  updatedTime: string = '';
  totalLike: number = 0;
  totalDislike: number = 0;
  reviewedByUser?: ReviewModel;
  pageIndex: number = 1;
  isEditingName = false;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private comicService: ComicService,
    private reviewService: ReviewService,
    private commentService: CommentService) { }



  ngOnInit(): void {
    const id = this.activeRoute.snapshot.paramMap.get('id');
    if (id) {
      this.comicService.getById(+id).subscribe(data => {
        this.comic = data;

        this.getComicReviews();

        this.listChapters = this.comic.chapters
          .sort((a, b) => b.chapterIndex - a.chapterIndex)
          .slice(0, 3)
          .map(chapter => Object.assign(new ChapterModel(), chapter));

        this.commentService.getByComicId(this.comic.id).subscribe(data => {
          this.listComments = data;
          this.listComments = this.listComments.sort().map(comment => Object.assign(new CommentModel(), comment));
        });

        this.updatedTime = Utils.getUpdatedDateTime(this.comic.updatedTime);
      });

      this.comicService.getAllPublishedOrderByTime().subscribe(data => {
        this.listComics = data;
        this.listRecommends.push(...this.listComics);
        this.listRecommends = this.listRecommends.sort((a, b) => b.view - a.view).slice(0, 6);
      });
    }
    else {
      this.router.navigate(['']);
    }
  }

  navigateToChapter(index: number) {
    this.router.navigate([`./chapter/${index}`], { relativeTo: this.activeRoute });
  }

  getComicReviews(): void {
    this.reviewService.getByComicId(this.comic.id).subscribe(data => {
      this.comic.reviews = data;
      this.calculateTotalLike(this.comic.reviews);
    });
  }

  likeComic(isLike: boolean) {
    if (!MainComponent.currentUser) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Vui lòng Login để thực hiện chức năng này!',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    if (this.reviewedByUser) {
      if ((isLike && this.reviewedByUser.type.toString() == ReviewType[ReviewType.LIKE])
        || (!isLike && this.reviewedByUser.type.toString() == ReviewType[ReviewType.DISLIKE])) {
        this.reviewService
          .delete(this.reviewedByUser.user!.id, this.reviewedByUser.comic!.id)
          .subscribe(data => this.getComicReviews());
      } else {
        this.reviewedByUser.type = isLike ? ReviewType.LIKE : ReviewType.DISLIKE;
        this.reviewService
          .update(this.reviewedByUser)
          .subscribe(data => this.getComicReviews());
      }
    }

    let review = new ReviewModel();
    review.type = isLike ? ReviewType.LIKE : ReviewType.DISLIKE;
    review.comic = this.comic;
    review.user = MainComponent.currentUser;

    this.reviewService.add(review).subscribe(data => this.getComicReviews());
  }

  calculateTotalLike(listReviews: ReviewModel[]) {
    this.totalLike = 0;
    this.totalDislike = 0;

    listReviews.forEach(review => {
      if (review.user?.id == MainComponent.currentUser?.id) {
        this.reviewedByUser = review;
      }

      if (review.type.toString() == ReviewType[ReviewType.LIKE]) {
        this.totalLike++;
      }
      else {
        this.totalDislike++;
      }
    })
  }

  searchByGenre(id: number) {
    this.router.navigate([`/search/genre/${id}`]).then(() => window.location.reload());
  }




}
