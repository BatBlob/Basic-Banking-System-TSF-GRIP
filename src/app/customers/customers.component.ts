import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import { RoutingService } from '../routing.service';
import {MatDialog} from '@angular/material/dialog';
import { TransferBoxComponent } from '../transfer-box/transfer-box.component';


@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  title: String = "";
  transfer_button: String = "";
  show: boolean = true;
  transfer_amount: string = "";

  error:string = "";

  customer_names = [];
  constructor(public backend_service: BackendService, private routing: RoutingService, public dialog: MatDialog) {
    

   }

  ngOnInit(): void {
    this.backend_service.retrieveCustomers();
    if (this.backend_service.transferring === false) {
      this.title = "Select Customer to Transfer from:";
      this.transfer_button = "Transfer Money";
      this.show = true;
    }
    else {
      console.log("TRANSFERRING");
      this.title = "Select Customer to Transfer to:";
      this.transfer_button = "Complete Transfer";
      this.show = false;
      this.backend_service.transferring = false;
    }
  }

  transferring(id: string, balance: number) { 
    if (this.show === false)
    {
      this.backend_service.set_transfer_to(id);
      this.backend_service.transfer();
      this.routing.navigate("customers");
      this.backend_service.transfer_status = "Transferring";
      this.openDialog()
    }
    else {
      if (balance < parseFloat(this.transfer_amount)) this.error = "* Amount to transfer cannot be larger than balance."
      else if (parseFloat(this.transfer_amount) == 0) this.error = "* Amount to transfer must be greater than 0."
      else {
        this.error = "";
        this.backend_service.set_transfer_from(id);
        this.backend_service.transfer_amount =  parseFloat(this.transfer_amount);
        this.backend_service.transferring = true;
        // this.ngOnInit();
        this.routing.navigate("customers");
      }
    }
  }

  openDialog() {
    this.dialog.open(TransferBoxComponent);
  }

}
