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

  transfer_list = [];

  constructor(private socket: Socket) {
    this.getCustomers().subscribe((names: any) => {
      console.log(names);
      this.customers = names;
    });

    this.getTransferStatus().subscribe((status: any) => {
      if (status == "true") this.transfer_status = "Transfer Complete";
      else if (status == "false") this.transfer_status = "Transfer Failed";
    });

    this.getTransfers().subscribe((transfers: any) => {
      console.log(transfers);
      for(let x in transfers) {
        transfers[x]["Date"] = new Date(transfers[x]["Time"]).toDateString();
        console.log(transfers[x]["Date"])
        transfers[x]["Time"] = new Date(transfers[x]["Time"]).getHours() + ":" + new Date(transfers[x]["Time"]).getMinutes() + ":" + new Date(transfers[x]["Time"]).getSeconds();

        transfers[x]["No."] = parseInt(x)+1;
      }
      this.transfer_list = transfers;
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

  retrieveTransfers() {
    this.socket.emit("requesttransfers");
  }
  getTransfers() {
    return Observable.create((observer: any) => {
      this.socket.on("requesttransfers", (message: any) => {
        observer.next(message);
      });
    });
  }
}
