import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChapterModel } from 'src/app/models/chapter.model';
import { CommentModel } from 'src/app/models/comment.model';
import { UserModel } from 'src/app/models/user.model';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-auto-height-input',
  templateUrl: './auto-height-input.component.html',
  styleUrls: ['./auto-height-input.component.scss']
})
export class AutoHeightInputComponent implements OnInit {
  @Output() onCommentPosted: EventEmitter<CommentModel> = new EventEmitter();

  @Input() chapter: ChapterModel = new ChapterModel();
  @Input() user: UserModel = new UserModel();

  commentStr: string = '';

  constructor(private commentService: CommentService) { }

  ngOnInit(): void {
  }

  autoGrowTextZone(evt: any): void {
    evt.target.style.height = "0px";
    evt.target.style.height = (evt.target.scrollHeight + 25) + "px";
  }

  postComment(): void {
    if (this.commentStr) {
      let newComment = new CommentModel();
      newComment.comment = this.commentStr;
      newComment.chapter = this.chapter;
      newComment.user = this.user;

      this.commentService.add(newComment).subscribe(data => {
        this.commentStr = '';
        this.onCommentPosted.emit(data);
      });
    }
  }
}
