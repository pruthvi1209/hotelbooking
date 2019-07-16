import {  NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookRoomComponent } from './book-room/book-room.component';
import { LowPriceComponent } from './low-price/low-price.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SignUpComponent } from './signUp/signUp.component';
import { AuthGuard } from './authGuard.service';


const routes: Routes = [
    {path: '', component: WelcomeComponent},
    {path: 'bookRoom', canActivate: [AuthGuard], component: BookRoomComponent},
    {path: 'lowPrice', component: LowPriceComponent },
    {path: 'signUp', component: SignUpComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule{}