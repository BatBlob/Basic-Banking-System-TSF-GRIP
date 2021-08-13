import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  customers:any[] = [];
  
  transferring: boolean = false;
  transfer_amount = 0;
  transfer_from = "";
  transfer_to = "";
  transfer_status: string = "";

  constructor(private socket: Socket) {
    this.getCustomers().subscribe((names: any) => {
      console.log(names);
      this.customers = names;
    });

    this.getTransferStatus().subscribe((status: any) => {
      if (status == "true") this.transfer_status = "Transfer Complete";
      else if (status == "false") this.transfer_status = "Transfer Failed";
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

  getTransferStatus() {
    return Observable.create((observer: any) => {
      this.socket.on("transferstatus", (message: any) => {
        observer.next(message);
      });
    });
  }

  set_transfer_from(id: string) {
    this.transfer_from = id;
  }

  set_transfer_to(id: string) {
    this.transfer_to = id;
  }

  transfer() {
    this.socket.emit("transfer", {from: this.transfer_from, to: this.transfer_to, amount: this.transfer_amount});
  }
}
