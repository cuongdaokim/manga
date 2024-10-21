import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { AdminDashboardPageComponent } from './pages/admin-dashboard-page/admin-dashboard-page.component';
import { AdminComicsPageComponent } from './pages/admin-comics-page/admin-comics-page.component';
import { AdminAuthorsPageComponent } from './pages/admin-authors-page/admin-authors-page.component';
import { AdminGenresPageComponent } from './pages/admin-genres-page/admin-genres-page.component';
import { AdminAccountsPageComponent } from './pages/admin-accounts-page/admin-accounts-page.component';
import { RouterModule } from '@angular/router';
import { AdminAddComicPageComponent } from './pages/admin-add-comic-page/admin-add-comic-page.component';
import { AdminAddAuthorPageComponent } from './pages/admin-add-author-page/admin-add-author-page.component';
import { AdminAddGenrePageComponent } from './pages/admin-add-genre-page/admin-add-genre-page.component';
import { AdminAddAccountPageComponent } from './pages/admin-add-account-page/admin-add-account-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AdminAddChapterPageComponent } from './pages/admin-add-chapter-page/admin-add-chapter-page.component';
import { NgxPaginationModule } from 'ngx-pagination';



@NgModule({
  declarations: [
    AdminComponent,
    AdminDashboardPageComponent,
    AdminComicsPageComponent,
    AdminAuthorsPageComponent,
    AdminGenresPageComponent,
    AdminAccountsPageComponent,
    AdminAddComicPageComponent,
    AdminAddAuthorPageComponent,
    AdminAddGenrePageComponent,
    AdminAddAccountPageComponent,
    AdminAddChapterPageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgMultiSelectDropDownModule.forRoot(),
    NgxPaginationModule
  ]
})
export class AdminModule { }
