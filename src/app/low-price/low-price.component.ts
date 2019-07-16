import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable } from '@angular/material';
import { HotelService } from '../shared/hotelService';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-low-price',
  templateUrl: './low-price.component.html',
  styleUrls: ['./low-price.component.css']
})
export class LowPriceComponent implements OnInit {
  sortedHotels = [];
  hotelsData = [];
  cityHotels = [];
  cities = [];
  formData = new FormControl();
  columnsToDisplay = ['city', 'name', 'price', 'available'];
  @ViewChild('table') table: MatTable<Element>;
  constructor(private hotelService: HotelService) {
    this.hotelService.getHotelsData().subscribe((value) => {
      this.hotelsData = value;
      this.sortedHotels = this.sortData(this.hotelsData).slice(0, 5);
      console.log(this.sortedHotels);
      this.table.renderRows();
    },
      (e) => console.log(e),
      () => {
        this.hotelsData.forEach(hotel => {
          if (!this.cities.includes(hotel.city)) {
            this.cities.push(hotel.city);
          }
        });
      });
  }
  ngOnInit() {
    this.formData.valueChanges.subscribe((value) => {
      console.log(value);
      this.cityHotels = this.hotelsData.filter((hotel) => {
        return hotel.city === value;
      });
      this.sortedHotels = this.sortData(this.cityHotels).slice(0, 5);
      console.log(this.sortedHotels);
      this.table.renderRows();
    });
  }
  sortData(data) {
    data = data.slice();
    return data.sort((a, b) => {
      return this.compare(a.price, b.price);
    });
  }
  compare(a, b) {
    return (a < b ? -1 : 1);
  }

}
