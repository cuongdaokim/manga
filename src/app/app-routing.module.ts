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
      { path: 'dang-nhap', component: LoginPageComponent },
      { path: 'dang-ky', component: SignupPageComponent },
      { path: 'truyen-tranh/:id', component: ComicDetailPageComponent },
      { path: 'truyen-tranh/:id/chuong/:chapterId', component: ComicChapterPageComponent },
      { path: 'tim-kiem/:keyword', component: SearchResultPageComponent },
      { path: 'tim-kiem/the-loai/:genreId', component: SearchResultPageComponent },
      { path: 'them-truyen', component: AddComicPageComponent },
      { path: 'them-chuong', component: AddChapterPageComponent },
      { path: 'cap-nhat-truyen/:id', component: AddComicPageComponent },
      { path: 'cap-nhat-chuong/:id', component: AddChapterPageComponent },
      { path: 'truyen-cua-toi', component: MyComicPageComponent },
      { path: 'thong-tin-ca-nhan', component: MyProfilePageComponent }
    ]
  },
  {
    path: 'quan-tri',
    component: AdminComponent,
    children: [
      { path: '', component: AdminDashboardPageComponent },
      { path: 'quan-ly-truyen', component: AdminComicsPageComponent },
      { path: 'quan-ly-the-loai', component: AdminGenresPageComponent },
      { path: 'quan-ly-tac-gia', component: AdminAuthorsPageComponent },
      { path: 'quan-ly-tai-khoan', component: AdminAccountsPageComponent },
      { path: 'them-truyen', component: AdminAddComicPageComponent },
      { path: 'them-chuong', component: AdminAddChapterPageComponent },
      { path: 'them-the-loai', component: AdminAddGenrePageComponent },
      { path: 'them-tac-gia', component: AdminAddAuthorPageComponent },
      { path: 'them-tai-khoan', component: AdminAddAccountPageComponent },
      { path: 'cap-nhat-truyen/:id', component: AdminAddComicPageComponent },
      { path: 'cap-nhat-chuong/:id', component: AdminAddChapterPageComponent },
      { path: 'cap-nhat-the-loai/:id', component: AdminAddGenrePageComponent },
      { path: 'cap-nhat-tac-gia/:id', component: AdminAddAuthorPageComponent },
      { path: 'cap-nhat-tai-khoan/:id', component: AdminAddAccountPageComponent },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
