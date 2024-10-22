import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ChapterModel } from '../models/chapter.model';
import { ComicModel } from '../models/comic.model';
import { RoleType, UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';
import {GenreModel} from "../models/genre.model";
import {GenreService} from "../services/genre.service";
import {AuthorService} from "../services/author.service";
import {AuthorModel} from "../models/author.model";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  static currentUser?: UserModel;
  static draftComic?: ComicModel;
  static draftChapter?: ChapterModel;
  searchStr: string = '';
  listGenres: GenreModel[] = [];
  listAuthors: AuthorModel[] = [];

  constructor(
    private elmRef: ElementRef,
    private router: Router,
    private userService: UserService, private genreService: GenreService, private authorService: AuthorService) { }

  ngOnInit(): void {
    this.initAvatarHoverEvent();

    let userId = localStorage.getItem('authorizeToken');
    if (userId) {
      this.userService.getById(+userId).subscribe(data =>
        MainComponent.currentUser = Object.assign(new UserModel(), data));
    }
    this.genreService.getAll().subscribe(data => {
      this.listGenres = data;
    });

    this.authorService.getAll().subscribe(data => {
      this.listAuthors = data;
    });
  }

  getCurrentUser(): UserModel | undefined {
    return MainComponent.currentUser;
  }

  isAdmin(): boolean {
    if (!MainComponent.currentUser)
      return false;

    return MainComponent.currentUser.role.toString() == RoleType[RoleType.ADMIN].toString();
  }

  onLogout(): void {
    Swal.fire({
      icon: 'question',
      title: 'Logout',
      text: 'Do you want logout?',
      showCancelButton: true,
      showConfirmButton: true,
      focusCancel: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: 'var(--color-primary)',
      cancelButtonColor: 'var(--color-danger)'
    }).then(result => {
      if (result.isConfirmed) {
        localStorage.removeItem('authorizeToken');
        window.location.reload();
      }
    });
  }

  onSearch(): void {
    this.router.navigate([`/search/${this.searchStr}`]).then(() => window.location.reload());
  }

  initAvatarHoverEvent(): void {
    let hoverPanel = this.elmRef.nativeElement.querySelector('.hover-panel') as HTMLElement;
    let avatar = this.elmRef.nativeElement.querySelector('.user-info') as HTMLElement;

    avatar.addEventListener('mouseover', () => {
      hoverPanel.style.display = 'flex';
    });

    avatar.addEventListener('mouseleave', () => {
      hoverPanel.style.display = 'none';
    });

    hoverPanel.addEventListener('mouseover', () => {
      hoverPanel.style.display = 'flex';
    });

    hoverPanel.addEventListener('mouseleave', () => {
      hoverPanel.style.display = 'none';
    });
  }

  searchByGenre(id: number) {
    this.router.navigate([`/search/genre/${id}`]).then(() => window.location.reload());
  }

  searchByAuthor(id: number) {
    this.router.navigate([`/search/author/${id}`]).then(() => window.location.reload());
  }
}
