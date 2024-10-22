import { Location } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { lastValueFrom } from 'rxjs';
import { AuthorModel } from 'src/app/models/author.model';
import { ChapterModel } from 'src/app/models/chapter.model';
import { ComicModel, StatusType } from 'src/app/models/comic.model';
import { ContentModel } from 'src/app/models/content.model';
import { GenreModel } from 'src/app/models/genre.model';
import { AuthorService } from 'src/app/services/author.service';
import { ChapterService } from 'src/app/services/chapter.service';
import { ComicService } from 'src/app/services/comic.service';
import { ContentService } from 'src/app/services/content.service';
import { GenreService } from 'src/app/services/genre.service';
import { UploadService } from 'src/app/services/upload.service';
import Swal from 'sweetalert2';
import { MainComponent } from '../../main.component';

@Component({
  selector: 'app-add-comic-page',
  templateUrl: './add-comic-page.component.html',
  styleUrls: ['./add-comic-page.component.scss']
})
export class AddComicPageComponent implements OnInit {
  @ViewChild('genreMultiSelect') genreMultiSelect: any;

  newComic: ComicModel = new ComicModel();
  coverImage?: File;
  authorName: string = '';
  editId?: number;

  addForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    author: new FormControl('', Validators.required),
    genres: new FormControl([], this.multiSelectRequired()),
    description: new FormControl('')
  });

  dropdownList: GenreModel[] = [];
  selectedItems: GenreModel[] = [];
  dropdownSettings: IDropdownSettings = {
    idField: 'id',
    textField: 'name',
    singleSelection: false,
    allowSearchFilter: true,
    selectAllText: 'Select All',
    unSelectAllText: 'Deselect all',
    searchPlaceholderText: 'Find',
    noDataAvailablePlaceholderText: 'No genre',
    noFilteredDataAvailablePlaceholderText: 'No genre found'
  };

  constructor(
    private elementRef: ElementRef,
    private genreService: GenreService,
    private authorService: AuthorService,
    private comicService: ComicService,
    private chapterService: ChapterService,
    private contentService: ContentService,
    private uploadService: UploadService,
    private router: Router,
    private activeRoute: ActivatedRoute,
    private location: Location) { }

  ngOnInit(): void {
    let userId = localStorage.getItem('authorizeToken');
    if (!userId) {
      this.router.navigate(['']);
      return;
    }

    const id = this.activeRoute.snapshot.paramMap.get('id');

    if (MainComponent.draftComic) {
      this.editId = MainComponent.draftComic.id;
      this.newComic = MainComponent.draftComic;
      this.coverImage = this.newComic.coverImage;
      this.selectedItems = this.newComic.genres;
      this.authorName = this.newComic.author!.name;
      this.loadCoverImage();
    }
    else if (id) {
      this.editId = +id;
      this.comicService.getById(this.editId).subscribe(data => {
        this.newComic = data;
        this.newComic.chapters = this.newComic.chapters.map(chapter => Object.assign(new ChapterModel(), chapter));
        this.newComic.chapters.sort((a, b) => a.chapterIndex - b.chapterIndex);
        this.authorName = this.newComic.author ? this.newComic.author.name : '';
        this.selectedItems = this.newComic.genres;
        this.loadCoverImage();
      });
    }

    this.genreService.getAll().subscribe(data => {
      this.dropdownList = data;
      this.genreMultiSelect.data = this.dropdownList;
    });
  }

  onImageSelected(event: any): void {
    this.coverImage = event.target.files[0];

    if (this.coverImage) {
      if ((this.coverImage.size / 1024 / 1024) > 2) {
        Swal.fire(
          'Image size too big',
          'Max size is 2MB',
          'error'
        );
        return;
      }

      this.loadCoverImage();
    }
  }

  loadCoverImage(): void {
    if (this.coverImage || this.editId || MainComponent.draftComic?.id != 0) {
      const upload = this.elementRef.nativeElement.querySelector('.upload-cover') as HTMLElement;

      const placeHolder = upload.querySelector('.upload-cover .placeholder') as HTMLElement;

      const wrapper = upload.querySelector('.upload-cover .cover-wrapper') as HTMLElement;
      const img = wrapper.querySelector('.cover') as HTMLImageElement;

      upload.style.padding = '0';
      upload.style.borderWidth = '0';

      placeHolder.style.display = 'none';

      wrapper.style.width = '100%';
      wrapper.style.height = '100%';

      img.onload = () => {
        URL.revokeObjectURL(img.src);  // no longer needed, free memory
      }

      if (this.coverImage) {
        img.src = URL.createObjectURL(this.coverImage); // set src to blob url
      } else {
        img.src = this.newComic.getComicCover(); // set src to blob url
      }
    }
  }

  onMultiSelectTouched(): void {
    this.addForm.get('genres')?.markAsTouched();
  }

  goBack(): void {
    MainComponent.draftComic = undefined;
    this.location.back();
  }

  navigateToAddChapter(chapter?: ChapterModel): void {
    MainComponent.draftComic = this.newComic;
    MainComponent.draftComic.coverImage = this.coverImage;
    MainComponent.draftComic.author = new AuthorModel();
    MainComponent.draftComic.author.name = this.authorName;
    MainComponent.draftComic.genres = this.selectedItems;

    MainComponent.draftChapter = chapter;

    this.router.navigate(['add-chapter']);
  }

  deleteChapter(chapter: ChapterModel): void {
    Swal.fire({
      icon: 'question',
      title: 'Delete',
      text: `Do u want to delete chapter ${chapter.chapterIndex}?`,
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: 'var(--color-danger)'
    }).then(result => {
      if (result.isConfirmed) {
        this.processDeleteChapter(chapter).then(() => console.log('success'));
      }
    });
  }

  async processDeleteChapter(chapter: ChapterModel): Promise<void> {
    let index = this.newComic.chapters.indexOf(chapter);
    this.newComic.chapters.splice(index, 1);

    if (chapter.id != 0) {
      for (let i = 0; i < chapter.contents.length; i++) {
        let content = chapter.contents[i];
        await lastValueFrom(
          this.uploadService
            .deleteByFolderWithFileName(this.newComic.id + '', content.id + '.jpg'));
      }

      this.chapterService.delete(chapter.id).subscribe(data => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Remove chapter successfully',
          showConfirmButton: false,
          timer: 1500
        });
      });
    }
  }

  async postComic(): Promise<void> {
    if (this.newComic.chapters.length == 0) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Need add at least 1 chapter',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    if (this.addForm.valid) {
      if (this.editId) {
        this.updateComic();
      }
      else {
        this.addComic();
      }
    }
    else {
      this.addForm.markAllAsTouched();
    }
  }

  async addComic(): Promise<void> {
    if (!this.coverImage) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Required Cover Art',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    else {

      this.newComic.status = StatusType.PENDING;

      this.newComic.author = await lastValueFrom(this.authorService.getByName(this.authorName));

      if (this.newComic.author.id == 0) {
        let newAuthor = new AuthorModel();
        newAuthor.name = this.authorName;

        this.newComic.author = await lastValueFrom(this.authorService.add(newAuthor));
      }

      this.newComic.genres = this.selectedItems;
      this.newComic.user = MainComponent.currentUser;

      let resultComic = await lastValueFrom(this.comicService.add(this.newComic));
      this.newComic.id = resultComic.id;

      let chapters = this.newComic.chapters;
      let resultChapters = await lastValueFrom(this.chapterService.addList(chapters, this.newComic.id));

      for (let i = 0; i < chapters.length; i++) {
        let chapter = chapters[i];
        chapter.id = resultChapters[i].id;

        for (let j = 0; j < chapter.contentImages.length; j++) {
          let image = chapter.contentImages[j];
          let content = new ContentModel();
          content.contentIndex = j;
          content.chapter = chapter;

          content = await lastValueFrom(this.contentService.add(content));
          await lastValueFrom(this.uploadService.upload(image, content.id + '.jpg', this.newComic.id + ''));
        }
      }


      this.uploadService.upload(this.coverImage, 'cover.jpg', this.newComic.id + '').subscribe(data => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Add manga successfully',
          showConfirmButton: false,
          timer: 1500
        }).then(result => {
          this.goBack();
        });
      });
    }
  }

  async updateComic(): Promise<void> {

    this.newComic.author = await lastValueFrom(this.authorService.getByName(this.authorName));

    if (this.newComic.author.id == 0) {
      let newAuthor = new AuthorModel();
      newAuthor.name = this.authorName;

      this.newComic.author = await lastValueFrom(this.authorService.add(newAuthor));
    }

    this.newComic.genres = this.selectedItems;
    this.newComic.user = MainComponent.currentUser;

    await lastValueFrom(this.comicService.update(this.newComic));


    if (this.coverImage) {
      this.uploadService.upload(this.coverImage, 'cover.jpg', this.newComic.id + '').subscribe(data => {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Update Manga Successfully',
          showConfirmButton: false,
          timer: 1500
        }).then(result => {
          this.goBack();
        });
      });
    }
    else {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Update Manga Successfully',
        showConfirmButton: false,
        timer: 1500
      }).then(result => {
        this.goBack();
      });
    }
  }



  multiSelectRequired(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      return control.value.length > 0 ? null : { multiRequired: true };
    };
  }
}
