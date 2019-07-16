import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {MatButtonModule, MatCheckboxModule, MatSelectModule, MatOptionModule, MatDatepickerModule,
        MatNativeDateModule, MatInputModule, MatTableModule, MatToolbarModule, MatMenuModule,
         MatIconModule, MatDialogModule} from '@angular/material';
import { BookRoomComponent } from './book-room/book-room.component';
import { LowPriceComponent } from './low-price/low-price.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HotelService } from './shared/hotelService';
import { SignUpComponent } from './signUp/signUp.component';
import { AuthService } from './authService';
import { AuthGuard } from './authGuard.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


@NgModule({
  declarations: [
    AppComponent,
    BookRoomComponent,
    LowPriceComponent,
    WelcomeComponent,
    SignUpComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    FlexLayoutModule,
    HttpClientModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTableModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatDialogModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [HotelService, AuthService, AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
