import {Component, ElementRef, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {lastValueFrom} from 'rxjs';
import {UserModel} from 'src/app/models/user.model';
import {ComicService} from 'src/app/services/comic.service';
import {UploadService} from 'src/app/services/upload.service';
import {UserService} from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-profile-page',
  templateUrl: './my-profile-page.component.html',
  styleUrls: ['./my-profile-page.component.scss']
})
export class MyProfilePageComponent implements OnInit {
  user: UserModel = new UserModel();
  comicCount: number = 0;
  draftUserName: string = '';

  avatarImage?: File;
  isEdit: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private router: Router,
    private userService: UserService,
    private comicService: ComicService,
    private uploadService: UploadService) {
  }

  ngOnInit(): void {
    let userId = localStorage.getItem('authorizeToken');
    if (userId) {
      this.userService.getById(+userId).subscribe(data => {
        this.user = Object.assign(new UserModel(), data);
        this.draftUserName = this.user.name;
        this.comicService.getByUserIdOrderByTime(this.user.id).subscribe(data => {
          this.comicCount = data.length;
        });
      });
    } else {
      this.router.navigate(['']);
    }
  }

  onImageSelected(event: any): void {
    this.avatarImage = event.target.files[0];

    if (this.avatarImage) {
      if ((this.avatarImage.size / 1024 / 1024) > 2) {
        Swal.fire(
          'Image size too big',
          'Max image size is 2MB',
          'error'
        );

        this.avatarImage = undefined;
        return;
      }

      const img = this.elementRef.nativeElement.querySelector('.avatar img') as HTMLImageElement;

      img.onload = () => {
        URL.revokeObjectURL(img.src);  // no longer needed, free memory
      }

      img.src = URL.createObjectURL(this.avatarImage); // set src to blob url
    }
  }

  editName(): void {
    this.isEdit = true;
    this.draftUserName = this.user.name;

    const viewGroup = this.elementRef.nativeElement.querySelector('.view') as HTMLElement;
    const editGroup = this.elementRef.nativeElement.querySelector('.edit') as HTMLElement;
    const input = editGroup.querySelector('input') as HTMLInputElement;

    viewGroup.setAttribute('hidden', '');
    editGroup.removeAttribute('hidden');
    input.focus();
  }

  cancelEdit(isFinish?: boolean): void {
    this.avatarImage = undefined;
    this.isEdit = false;

    const img = this.elementRef.nativeElement.querySelector('.avatar img') as HTMLImageElement;
    const viewGroup = this.elementRef.nativeElement.querySelector('.view') as HTMLElement;
    const editGroup = this.elementRef.nativeElement.querySelector('.edit') as HTMLElement;

    viewGroup.removeAttribute('hidden');
    editGroup.setAttribute('hidden', '');

    if (!isFinish)
      img.src = this.user.getAvatar(); // set src to blob url
  }

  async updateUserInfo(): Promise<void> {
    if (!this.draftUserName) {
      Swal.fire(
        'Lỗi!',
        'Username required',
        'error'
      );
      return;
    }

    if (this.user.name != this.draftUserName) {
      this.user.name = this.draftUserName;
      await lastValueFrom(this.userService.update(this.user));
    }

    if (this.avatarImage) {
      await lastValueFrom(this.uploadService.upload(this.avatarImage, `${this.user.id}.jpg`));
    }

    Swal.fire({
      position: 'center',
      icon: 'success',
      title:
        'Update information successfully',
      showConfirmButton: false,
      timer: 1500
    }).then(() => {
      window.location.reload();
    });
  }
}
