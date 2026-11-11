import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppShellComponent } from './app-shell.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { fumateListComponent } from './items/item-list.component';
import { fumateFormComponent } from './items/item-form.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { SupabaseService } from './services/supabase.service';

@NgModule({
  declarations: [
    AppShellComponent,
    AppComponent,
    fumateListComponent,
    fumateFormComponent,
    LoginComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [SupabaseService],
  bootstrap: [AppShellComponent]
})
export class AppModule { }

