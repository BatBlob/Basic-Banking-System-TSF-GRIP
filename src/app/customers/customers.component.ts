import { Component, OnInit, ViewChild } from '@angular/core';
import { BackendService } from '../backend.service';
import {MatAccordion} from '@angular/material/expansion';

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
