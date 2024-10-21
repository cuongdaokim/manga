import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChapterModel } from '../models/chapter.model';
import { ComicModel } from '../models/comic.model';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, AfterViewInit {
  static currentUser?: UserModel;
  static draftComic?: ComicModel;
  static draftChapter?: ChapterModel;

  constructor(private elmRef: ElementRef, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
    let userId = localStorage.getItem('authorizeToken');
    if (userId) {
      this.userService.getById(+userId).subscribe(data => AdminComponent.currentUser = data);
    } else {
      this.router.navigate(['']);
    }
  }

  getCurrentUser(): UserModel | undefined {
    return AdminComponent.currentUser;
  }

  ngAfterViewInit(): void {
    this.initToggleEvent();
  }

  initToggleEvent(): void {
    let toggle = this.elmRef.nativeElement.querySelector('.toggle') as HTMLElement;
    let navigation = this.elmRef.nativeElement.querySelector('.navigation') as HTMLElement;
    let main = this.elmRef.nativeElement.querySelector('body') as HTMLElement;

    toggle.addEventListener('click', () => {
      navigation.classList.toggle('active');
      main.classList.toggle('active');
    })
  }
}
