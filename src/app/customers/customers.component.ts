import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  customer_names = [];
  constructor(public backend_service: BackendService) { }

  ngOnInit(): void {
    this.backend_service.retrieveCustomers();
  }



}
