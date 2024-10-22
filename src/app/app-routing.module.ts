import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AdminAccountsPageComponent } from './admin/pages/admin-accounts-page/admin-accounts-page.component';
import { AdminAddAccountPageComponent } from './admin/pages/admin-add-account-page/admin-add-account-page.component';
import { AdminAddAuthorPageComponent } from './admin/pages/admin-add-author-page/admin-add-author-page.component';
import { AdminAddChapterPageComponent } from './admin/pages/admin-add-chapter-page/admin-add-chapter-page.component';
import { AdminAddComicPageComponent } from './admin/pages/admin-add-comic-page/admin-add-comic-page.component';
import { AdminAddGenrePageComponent } from './admin/pages/admin-add-genre-page/admin-add-genre-page.component';
import { AdminAuthorsPageComponent } from './admin/pages/admin-authors-page/admin-authors-page.component';
import { AdminComicsPageComponent } from './admin/pages/admin-comics-page/admin-comics-page.component';
import { AdminDashboardPageComponent } from './admin/pages/admin-dashboard-page/admin-dashboard-page.component';
import { AdminGenresPageComponent } from './admin/pages/admin-genres-page/admin-genres-page.component';
import { MainComponent } from './main/main.component';
import { AddChapterPageComponent } from './main/pages/add-chapter-page/add-chapter-page.component';
import { AddComicPageComponent } from './main/pages/add-comic-page/add-comic-page.component';
import { ComicChapterPageComponent } from './main/pages/comic-chapter-page/comic-chapter-page.component';
import { ComicDetailPageComponent } from './main/pages/comic-detail-page/comic-detail-page.component';
import { HomePageComponent } from './main/pages/home-page/home-page.component';
import { LoginPageComponent } from './main/pages/login-page/login-page.component';
import { MyComicPageComponent } from './main/pages/my-comic-page/my-comic-page.component';
import { MyProfilePageComponent } from './main/pages/my-profile-page/my-profile-page.component';
import { SearchResultPageComponent } from './main/pages/search-result-page/search-result-page.component';
import { SignupPageComponent } from './main/pages/signup-page/signup-page.component';

 const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      { path: '', component: HomePageComponent },
      { path: 'login', component: LoginPageComponent },
      { path: 'register', component: SignupPageComponent },
      { path: 'manga/:id', component: ComicDetailPageComponent },
      { path: 'manga/:id/chapter/:chapterId', component: ComicChapterPageComponent },
      { path: 'search/:keyword', component: SearchResultPageComponent },
      { path: 'search/genre/:genreId', component: SearchResultPageComponent },
      { path: 'search/author/:authorId', component: SearchResultPageComponent },
      { path: 'add-manga', component: AddComicPageComponent },
      { path: 'add-chapter', component: AddChapterPageComponent },
      { path: 'update-manga/:id', component: AddComicPageComponent },
      { path: 'update-chapter/:id', component: AddChapterPageComponent },
      { path: 'my-manga', component: MyComicPageComponent },
      { path: 'my-account', component: MyProfilePageComponent }
    ]
  },
  {
    path: 'manage',
    component: AdminComponent,
    children: [
      { path: '', component: AdminDashboardPageComponent },
      { path: 'manage-manga', component: AdminComicsPageComponent },
      { path: 'manage-genre', component: AdminGenresPageComponent },
      { path: 'manage-author', component: AdminAuthorsPageComponent },
      { path: 'manage-account', component: AdminAccountsPageComponent },
      { path: 'add-manga', component: AdminAddComicPageComponent },
      { path: 'add-chapter', component: AdminAddChapterPageComponent },
      { path: 'add-genre', component: AdminAddGenrePageComponent },
      { path: 'add-author', component: AdminAddAuthorPageComponent },
      { path: 'add-account', component: AdminAddAccountPageComponent },
      { path: 'update-manga/:id', component: AdminAddComicPageComponent },
      { path: 'update-chapter/:id', component: AdminAddChapterPageComponent },
      { path: 'update-genre/:id', component: AdminAddGenrePageComponent },
      { path: 'update-author/:id', component: AdminAddAuthorPageComponent },
      { path: 'update-account/:id', component: AdminAddAccountPageComponent },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
