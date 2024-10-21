import { Location } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { ChapterModel } from 'src/app/models/chapter.model';
import { ContentModel } from 'src/app/models/content.model';
import { ChapterService } from 'src/app/services/chapter.service';
import { ContentService } from 'src/app/services/content.service';
import { UploadService } from 'src/app/services/upload.service';
import { Utils } from 'src/app/utils/utils';
import Swal from 'sweetalert2';
import { MainComponent } from '../../main.component';

@Component({
  selector: 'app-add-chapter-page',
  templateUrl: './add-chapter-page.component.html',
  styleUrls: ['./add-chapter-page.component.scss']
})
export class AddChapterPageComponent implements OnInit {
  newChapter: ChapterModel = new ChapterModel;
  comicId: number = 0;
  selectedImage?: File;

  addForm: FormGroup = new FormGroup({
    name: new FormControl(''),
    index: new FormControl(1)
  });

  listImages: File[] = [];
  listDeleted: ContentModel[] = [];

  constructor(
    private location: Location,
    private elementRef: ElementRef,
    private router: Router,
    private chapterService: ChapterService,
    private contentService: ContentService,
    private uploadService: UploadService) { }

  ngOnInit(): void {
    window.onscroll = () => this.scrollFunction();

    let userId = localStorage.getItem('authorizeToken');
    if (!userId) {
      this.router.navigate(['']);
      return;
    }

    this.comicId = MainComponent.draftComic?.id ?? 0;

    if (MainComponent.draftChapter) {
      this.newChapter = MainComponent.draftChapter;
      this.listImages = this.newChapter.contentImages;

      if (this.newChapter.id != 0) {
        this.contentService.getByChapterId(this.newChapter.id).subscribe(data => {
          this.newChapter.contents = data;
          this.newChapter.contents.forEach(content =>
            this.loadImageFromContent(content, MainComponent.draftComic!.id));

          this.listImages.forEach(image => this.loadImage(image));
        });
      }
      else {
        this.listImages.forEach(image => this.loadImage(image));
      }
    }
  }

  goBack(): void {
    this.location.back();
  }

  moveImage(oldIndex: number, newIndex: number): void {
    if (newIndex >= this.listImages.length || newIndex < 0) {
      return;
    }

    this.listImages = Utils.moveItemInArray(this.listImages, oldIndex, newIndex);
    const listImgElem = this.elementRef.nativeElement.querySelectorAll('.contents img');
    console.log(this.listImages);
    listImgElem[oldIndex].src = URL.createObjectURL(this.listImages[oldIndex]);
    listImgElem[newIndex].src = URL.createObjectURL(this.listImages[newIndex]);
  }

  moveUp(): void {
    if (this.selectedImage) {
      let index = this.listImages.indexOf(this.selectedImage);
      let newIndex = index--;
      this.moveImage(index, newIndex);
    }
  }

  moveDown(): void {
    if (this.selectedImage) {
      let index = this.listImages.indexOf(this.selectedImage);
      let newIndex = index++;
      this.moveImage(index, newIndex);
    }
  }

  async postChapter(): Promise<void> {
    if (MainComponent.draftComic) {
      if ((this.listImages.length == 0 && this.newChapter.id == 0)
        || (this.newChapter.id != 0 && this.newChapter.contents.length == 0)) {
        Swal.fire(
          `Không hợp lệ!`,
          `Vui lòng thêm nội dung cho chương này`,
          'error'
        );
        return;
      }

      let duplicateIndex = -1;
      MainComponent.draftComic.chapters.forEach(chapter => {
        if (this.newChapter.chapterIndex === chapter.chapterIndex) {
          if (this.newChapter.id == 0 || (this.newChapter.id != 0 && this.newChapter.id != chapter.id)) {
            duplicateIndex = chapter.chapterIndex;
            return;
          }
        }
      });

      if (duplicateIndex === -1) {
        this.toggleSpinner();

        this.newChapter.contentImages = this.listImages;
        let prefix = this.newChapter.id == 0 ? 'Thêm' : 'Cập nhật';

        let chapter = this.newChapter;

        if (chapter.id == 0) {
          if (this.comicId != 0) {
            chapter = await lastValueFrom(this.chapterService.add(this.newChapter, this.comicId));
            this.newChapter.id = chapter.id;
          }

          MainComponent.draftComic.chapters.push(this.newChapter);
          MainComponent.draftComic.chapters.sort((a, b) => a.chapterIndex - b.chapterIndex);
        }
        else if (this.comicId != 0) {
          chapter = await lastValueFrom(this.chapterService.update(this.newChapter, this.comicId));
        }

        if (this.comicId != 0) {
          this.newChapter.contentImages = [];
          this.listDeleted.forEach(async content => {
            await lastValueFrom(this.contentService.delete(content.id));
            await lastValueFrom(
              this.uploadService.deleteByFolderWithFileName(`${this.comicId}`, `${content.id}.jpg`));
          });

          let total = this.newChapter.contents.length + this.listImages.length;

          for (let i = 0; i < total; i++) {
            if (i < this.newChapter.contents.length) {
              let content = this.newChapter.contents[i];
              let updateContent = new ContentModel();
              updateContent.id = content.id;
              updateContent.contentIndex = i;
              updateContent.chapter = this.newChapter;

              await lastValueFrom(this.contentService.update(updateContent));
            }
            else {
              let image = this.listImages[i - this.newChapter.contents.length];
              let content = new ContentModel();
              content.contentIndex = i;
              content.chapter = chapter;

              content = await lastValueFrom(this.contentService.add(content));
              await lastValueFrom(this.uploadService.upload(image, content.id + '.jpg', this.comicId + ''));
            }
          }
        }

        this.toggleSpinner();

        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: `${prefix} chương truyện thành công!`,
          showConfirmButton: false,
          timer: 1000
        }).then(result => {
          this.goBack();
        });
      }
      else {
        Swal.fire(
          `Không hợp lệ`,
          `Chương ${duplicateIndex} đã tồn tại!`,
          'error'
        );
      }
    }
  }

  toggleSpinner(): void {
    let spinner = this.elementRef.nativeElement.querySelector('.spinner') as HTMLElement;
    spinner.classList.toggle('hidden');
  }

  onImageSelected(event: any): void {
    let oldLength = this.listImages.length;

    this.listImages.push(...event.target.files);

    for (let i = oldLength; i < this.listImages.length; i++) {
      let image = this.listImages[i];

      if ((image.size / 1024 / 1024) > 2) {
        this.listImages.splice(this.listImages.indexOf(image), 1);

        Swal.fire(
          'Có ảnh có kích thước quá lớn!',
          'Kích thước ảnh tối đa cho phép là 2MB',
          'error'
        );
      }
      else {
        this.loadImage(image);
      }
    }

    setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 55);
  }

  loadImage(image: File): void {
    const moveGroup = this.elementRef.nativeElement.querySelector('.move-group') as HTMLElement;
    const wrapper = this.elementRef.nativeElement.querySelector('.add-content-group .contents') as HTMLElement;

    const container = document.createElement('div');
    container.style.position = 'relative';

    const removeBtn = document.createElement('span');
    removeBtn.innerHTML = '<i class="uil uil-multiply"></i>';
    removeBtn.style.position = 'absolute';
    removeBtn.style.top = '0.5rem';
    removeBtn.style.right = '0.5rem';
    removeBtn.style.fontSize = '2rem';
    removeBtn.style.color = 'var(--color-danger)';
    removeBtn.style.fontWeight = '500';
    removeBtn.style.cursor = 'pointer';
    removeBtn.addEventListener('click', () => {
      let index = this.listImages.indexOf(image);
      this.listImages = this.listImages.splice(index, 1);
      container.remove();
    });

    const img = document.createElement('img');
    img.addEventListener('mouseenter', () => {
      img.style.border = '3px solid var(--color-primary)';
      // moveGroup.style.display = 'flex';
      // container.appendChild(moveGroup);
      // this.selectedImage = image;
    });
    img.addEventListener('mouseleave', () => {
      img.style.borderWidth = '0';
    });
    img.onload = () => {
      URL.revokeObjectURL(img.src);  // no longer needed, free memory
    }
    img.src = URL.createObjectURL(image); // set src to blob url

    container.appendChild(img);
    container.appendChild(removeBtn);

    wrapper.appendChild(container);
  }

  loadImageFromContent(content: ContentModel, comicId: number) {
    content = Object.assign(new ContentModel(), content);

    const moveGroup = this.elementRef.nativeElement.querySelector('.move-group') as HTMLElement;
    const wrapper = this.elementRef.nativeElement.querySelector('.add-content-group .contents') as HTMLElement;

    const container = document.createElement('div');
    container.style.position = 'relative';

    const removeBtn = document.createElement('span');
    removeBtn.innerHTML = '<i class="uil uil-multiply"></i>';
    removeBtn.style.position = 'absolute';
    removeBtn.style.top = '0.5rem';
    removeBtn.style.right = '0.5rem';
    removeBtn.style.fontSize = '2rem';
    removeBtn.style.color = 'var(--color-danger)';
    removeBtn.style.fontWeight = '500';
    removeBtn.style.cursor = 'pointer';
    removeBtn.addEventListener('click', () => {
      let index = this.newChapter.contents.indexOf(content);
      this.listDeleted.push(content);
      this.newChapter.contents = this.newChapter.contents.splice(index, 1);
      container.remove();
    });

    const img = document.createElement('img');
    img.addEventListener('mouseenter', () => {
      img.style.border = '3px solid var(--color-primary)';
      // moveGroup.style.display = 'flex';
      // container.appendChild(moveGroup);
    });
    img.addEventListener('mouseleave', () => {
      img.style.borderWidth = '0';
    });
    img.onload = () => {
      URL.revokeObjectURL(img.src);  // no longer needed, free memory
    }
    img.src = content.getContentImage(comicId); // set src to blob url

    container.appendChild(img);
    container.appendChild(removeBtn);

    wrapper.appendChild(container);
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
}
