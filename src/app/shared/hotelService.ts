import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

const httpOption = {
    headers: new HttpHeaders({'Content-type': 'application/json'})
};

@Injectable()

export class HotelService {
    private url = 'assets/hotles.json';
    private ref = firebase.app().database().ref();
    constructor(private http: HttpClient) {}
    getHotelsData() {
        return this.http.get(this.url).pipe(map((res: any) => {
            return res;
        }
        ));
    }
    register(id, body, childId) {
        console.log(id, childId);
         return this.ref.child(id).child(childId).set(body);
        }
    // getHistory(id, day) {
    //     // this.ref.child(id).child(day).orderByKey();
    //     return this.http.get('https://hotelbooking-e32f2.firebaseio.com/' + id + day +  '.json');
    // }
    getHistory(id, date) {
        return this.http.get('https://hotelbooking-e32f2.firebaseio.com/' + id + '/' + date + '/available.json').pipe(map((value) => {
            return value;
        }));
    }
    }
