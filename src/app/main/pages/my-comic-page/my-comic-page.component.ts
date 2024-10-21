import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ComicModel, StatusType } from 'src/app/models/comic.model';
import { ComicService } from 'src/app/services/comic.service';
import { UploadService } from 'src/app/services/upload.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-comic-page',
  templateUrl: './my-comic-page.component.html',
  styleUrls: ['./my-comic-page.component.scss']
})
export class MyComicPageComponent implements OnInit {
  listComics: ComicModel[] = [];
  listOrigin: ComicModel[] = [];
  searchStr: string = '';
  pageIndex: number = 0;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private comicService: ComicService,
    private uploadService: UploadService
  ) { }

  ngOnInit(): void {
    this.getMyComics();
  }

  async getMyComics(): Promise<void> {
    let userId = localStorage.getItem('authorizeToken');
    if (userId) {
      this.comicService.getByUserIdOrderByTime(+userId).subscribe(data => {
        this.listOrigin = data;
        this.listComics = data;
        this.listComics.forEach(async comic => {
          comic.statusString = this.getComicStatusString(comic);
          comic.statusClass = this.getComicStatusClass(comic);
        });
      });
    } else {
      this.router.navigate(['']);
    }
  }

  search(): void {
    if (this.searchStr) {
      this.listComics = this.listOrigin.filter(comic => comic.title.includes(this.searchStr));
    }
  }

  offSearch(): void {
    if (!this.searchStr) {
      this.listComics = this.listOrigin;
    }
  }

  onTableMouseLeave(): void {
    const placeHolder = this.elementRef.nativeElement.querySelector('.placeholder') as HTMLElement;
    const wrapper = this.elementRef.nativeElement.querySelector('.preview .cover') as HTMLElement;

    wrapper.setAttribute('hidden', '');
    placeHolder.removeAttribute('hidden');
  }

  onRowDataHover(comic: ComicModel): void {
    comic = Object.assign(new ComicModel(), comic);

    const placeHolder = this.elementRef.nativeElement.querySelector('.placeholder') as HTMLElement;

    const wrapper = this.elementRef.nativeElement.querySelector('.preview .cover') as HTMLElement;
    const img = wrapper.querySelector('img') as HTMLImageElement;

    placeHolder.setAttribute('hidden', '');
    wrapper.removeAttribute('hidden');

    img.src = comic.getComicCover();
  }

  addComic(): void {
    this.router.navigate(['them-truyen']);
  }

  editComic(id: number): void {
    this.router.navigate([`cap-nhat-truyen/${id}`]);
  }

  removeComic(id: number): void {
    Swal.fire({
      icon: 'question',
      title: 'Xóa',
      text: `Bạn có chắc muốn xóa truyện có mã '${id}'?`,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Không',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: 'var(--color-danger)'
    }).then(async result => {
      if (result.isConfirmed) {
        await lastValueFrom(this.comicService.delete(id));
        this.uploadService.deleteByPath(`${id}`).subscribe(
          data => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Xóa thành công!',
              showConfirmButton: false,
              timer: 1000
            }).then(result => {
              this.getMyComics();
            });
          },
          error => {
            console.log(error);
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: 'Có lỗi xảy ra!',
              showConfirmButton: false,
              timer: 1500
            });
          });
      }
    });
  }

  getComicUpdatedTimeDiff(date: Date): string {
    return Utils.getTimeDiff(date);
  }

  getComicStatusString(comic: ComicModel): string {
    let result = '';

    switch (comic.status.toString()) {
      case StatusType[StatusType.PENDING]: {
        result = 'Chờ duyệt';
        break;
      }
      case StatusType[StatusType.PUBLISH]: {
        result = 'Duyệt';
        break;
      }
      case StatusType[StatusType.UNPUBLISH]: {
        result = 'Ẩn';
        break;
      }
      case StatusType[StatusType.REJECTED]: {
        result = 'Từ chối';
        break;
      }
    }

    return result;
  }

  getComicStatusClass(comic: ComicModel): string {
    let result = '';

    switch (comic.status.toString()) {
      case StatusType[StatusType.PENDING]: {
        result = 'pending';
        break;
      }
      case StatusType[StatusType.PUBLISH]: {
        result = 'publish';
        break;
      }
      case StatusType[StatusType.UNPUBLISH]: {
        result = 'unpublish';
        break;
      }
      case StatusType[StatusType.REJECTED]: {
        result = 'reject';
        break;
      }
    }

    return result;
  }
}
