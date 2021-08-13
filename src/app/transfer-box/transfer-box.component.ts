import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';

@Component({
  selector: 'app-transfer-box',
  templateUrl: './transfer-box.component.html',
  styleUrls: ['./transfer-box.component.css']
})
export class TransferBoxComponent implements OnInit {

  constructor(public backend_service: BackendService) { }

  ngOnInit(): void {
  }

}
