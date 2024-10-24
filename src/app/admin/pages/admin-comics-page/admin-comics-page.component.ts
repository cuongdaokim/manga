import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ComicModel, StatusType } from 'src/app/models/comic.model';
import { ComicService } from 'src/app/services/comic.service';
import { UploadService } from 'src/app/services/upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-comics-page',
  templateUrl: './admin-comics-page.component.html',
  styleUrls: ['./admin-comics-page.component.scss']
})
export class AdminComicsPageComponent implements OnInit {
  listComics: ComicModel[] = [];
  listOrigin: ComicModel[] = [];
  isCoverLoaded: boolean = false;
  exchangeText: string = 'Pending approval'
  isPendingApprove: boolean = false;
  pageIndex: number = 1;
  searchStr: string = '';

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private comicService: ComicService,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    this.getAllComics();
  }

  async getAllComics(): Promise<void> {
    this.listComics = await lastValueFrom(this.comicService.getAllOrderByTime());
    this.listComics.forEach(async comic => {
      comic.statusString = this.getComicStatusString(comic);
      comic.statusClass = this.getComicStatusClass(comic);
    });

    this.listOrigin = this.listComics;
  }

  togglePendingApprove(): void {
    this.searchStr = '';

    this.isPendingApprove = !this.isPendingApprove;
    this.exchangeText = this.isPendingApprove ? 'All' : 'Pending approval';

    if (this.isPendingApprove) {
      this.listComics = this.listOrigin.filter(comic =>
        comic.status.toString() == StatusType[StatusType.PENDING]);
    }
    else {
      this.listComics = this.listOrigin;
    }
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

  onTableMouseLeave(): void {
    const placeHolder = this.elementRef.nativeElement.querySelector('.placeholder') as HTMLElement;
    const wrapper = this.elementRef.nativeElement.querySelector('.preview .cover') as HTMLElement;

    wrapper.setAttribute('hidden', '');
    placeHolder.removeAttribute('hidden');
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

  addComic(): void {
    this.router.navigate(['manage/add-manga']);
  }

  editComic(id: number): void {
    this.router.navigate([`manage/update-manga/${id}`]);
  }

  removeComic(id: number): void {
    Swal.fire({
      icon: 'question',
      title: 'Delete',
      text: `Do you want to delete manga with '${id}'?`,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: 'var(--color-danger)'
    }).then(async result => {
      if (result.isConfirmed) {
        await lastValueFrom(this.comicService.delete(id));
        this.uploadService.deleteByPath(`${id}`).subscribe(
          data => {
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Delete successfully',
              showConfirmButton: false,
              timer: 1000
            }).then(result => {
              this.getAllComics();
            });
          },
          error => {
            console.log(error);
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Something went wrong',
              showConfirmButton: false,
              timer: 1500
            });
          });
      }
    });
  }

  getComicStatusString(comic: ComicModel): string {
    let result = '';

    switch (comic.status.toString()) {
      case StatusType[StatusType.PENDING]: {
        result = 'Pending';
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
        result = 'rejected';
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
