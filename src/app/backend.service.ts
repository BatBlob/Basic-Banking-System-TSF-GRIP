import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  customers:any[] = [];

  constructor(private socket: Socket) {
    this.getCustomers().subscribe((names: any) => {
      console.log(names);
      this.customers = names;
    });
   }

  retrieveCustomers() {
    this.socket.emit("getcustomers");
  }

  getCustomers() {
    return Observable.create((observer: any) => {
      this.socket.on("getcustomers", (message: any) => {
        observer.next(message);
      });
    });
  }
}
