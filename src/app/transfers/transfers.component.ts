import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-transfers',
  templateUrl: './transfers.component.html',
  styleUrls: ['./transfers.component.css']
})
export class TransfersComponent implements OnInit {
  displayedColumns: string[] = ['No.', 'Sender', 'Recipient', 'Amount', 'Date', 'Time'];
  constructor(public backend_service: BackendService) { }

  ngOnInit(): void {
    this.backend_service.retrieveTransfers();
  }

}
