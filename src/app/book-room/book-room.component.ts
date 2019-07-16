import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { HotelService } from '../shared/hotelService';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material';
import { AuthService } from '../authService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-room',
  templateUrl: './book-room.component.html',
  styleUrls: ['./book-room.component.css']
})
export class BookRoomComponent implements OnInit {

  private hotelsData;
  private startDate;
  private endDate;
  dateMisMatch = true;
  private timer;
  filterHotels = [];
  private selectedHotel;
  hotelGroup: FormGroup;
  startDatePicker: FormControl;
  endDatePicker: FormControl;
  cities = [];
  checkInMinDate = new Date();
  checkInMaxDate = new Date(2020, 0 , 1 );
  maxDate = this.checkInMaxDate;
  formData: any;
  bookingNumber = Math.random().toString(36).split('.')[1];
  bookingPrice: number;
  newUser = false;
    @ViewChild('errorDialog') errorDialog: TemplateRef<any>;
    @ViewChild('successDialog') successDialog: TemplateRef<any>;

  constructor(private hotelService: HotelService, private http: HttpClient, private dialog: MatDialog,
    private authService: AuthService, private router: Router) {
  }

  ngOnInit() {

    this.hotelGroup = new FormGroup({
      city: new FormControl(),
      selectHotel: new FormControl(),
      startDatePicker: new FormControl({max : this.checkInMaxDate}),
      endDatePicker: new FormControl(),
      rooms: new FormControl()
    });
    this.hotelService.getHotelsData().subscribe((data) => {
      this.hotelsData = data;
      data.forEach(hotel => {
        if (!this.cities.includes(hotel.city)) {
          this.cities.push(hotel.city);
        }
      });
    });
    console.log(this.hotelsData);
    this.hotelGroup.get(['city']).valueChanges.subscribe((term) => {
      this.filterHotels = this.hotelsData.filter((hotel) => {
        return hotel.city === term;
      });
    });
    this.hotelGroup.get(['selectHotel']).valueChanges.subscribe((hotelName) => {
      this.filterHotels.forEach((hotel) => {
        if (hotel.name === hotelName) {
          this.selectedHotel = hotel;
        }
      });
    });
    this.hotelGroup.get(['startDatePicker']).valueChanges.subscribe((fromDate) => {
      this.startDate = new Date (fromDate);
    });
    this.hotelGroup.get(['endDatePicker']).valueChanges.subscribe((endDate) => {
      if (!endDate) {
        this.checkInMaxDate = new Date(2020, 0, 1);
        return;
      }
      this.checkInMaxDate = new Date(endDate);
    });
  }


  getErrors() {
    this.hotelGroup.get(['city']).markAsTouched();
  }

  getDateDiff(fromDate, toDate) {
    const date1 = new Date(fromDate);
    const date2 = new Date(toDate);
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return diffDays;
  }

  getDateFormat(inputDate) {
    const event = new Date(inputDate);
    const options = { day: 'numeric', month: 'numeric', year: 'numeric' };
    return (event.toLocaleDateString('en-IN', options));
  }

  onSubmit(formData) {
    if (!formData.valid) { return; }
    this.formData = formData;
    this.bookingPrice = this.selectedHotel.price * formData.value.rooms;
    const fromDate = formData.value.startDatePicker;
    const toDate = formData.value.endDatePicker;
    const noOfDays = this.getDateDiff(fromDate, toDate);
    this.checkHotelVacancy(noOfDays, this.selectedHotel.available, formData.value.rooms, fromDate).then((rooms) => {
      clearInterval(this.timer);
      this.timer = null;
      for (let j = 0; j <= noOfDays; j++) {
        const available = rooms.reduce((a, b) => a + b, 0) === 0 ? this.selectedHotel.available : rooms[j];
        const body = { available:   available - formData.value.rooms };
        if (body.available >= 0) {
        this.hotelService.register(this.selectedHotel.id, body, this.getDateFormat(fromDate)).then((value) => console.log(value))
        .catch((e) => console.log(e));
        } else {
          this.dialog.open(this.errorDialog);
          break;
        }
        fromDate.setDate(fromDate.getDate() + 1);
        if ( j === noOfDays) {
          this.dialog.open(this.successDialog);
        }
      }
    }).catch((e) => {
      console.log(e);
      clearInterval(this.timer);
      this.timer = null;
      this.dialog.open(this.errorDialog);
    });
  }

  checkHotelVacancy(noOfDays, hotelRooms, reqRooms, checkInDate): Promise<any> {
    let allowBooking = true;
    const roomsStatus = new Array(noOfDays);
    return new Promise((resolve, reject) => {
      for (let i = 0; i <= noOfDays; i++) {
        const date = new Date();
         this.newUser = false;
        const data = this.hotelService.getHistory(this.selectedHotel.id, this.getDateFormat(date.setDate(checkInDate.getDate() + i)));
        data.subscribe((value) => {
          if ((hotelRooms < reqRooms || value < reqRooms) && value) {
            console.log(hotelRooms, reqRooms, value);
            allowBooking = false;
            reject('rooms alredy booked');
          } else {
            if (value === 0) {
              reject('rooms alredy booked');
            }
            roomsStatus[i] = value ? value : 0;
          }
        },
          (e) => { },
          () => {
              if ( (allowBooking || this.newUser) && i === noOfDays) {
              this.timer = setInterval(() => {
                if ( roomsStatus.length - 1 === noOfDays) {
                  console.log('Resolved', roomsStatus);
                  resolve(roomsStatus);
                } else {
                  console.log('timer fired', i, noOfDays, roomsStatus.length, allowBooking);
                }
                clearInterval(this.timer);
                this.timer = null;
              }, 2000);
            }
          }
        );
      }
    });
  }
  clearForm() {
    this.successBooking();
  }
  successBooking() {
    this.router.navigate(['/']);
  }
}
