import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferBoxComponent } from './transfer-box.component';

describe('TransferBoxComponent', () => {
  let component: TransferBoxComponent;
  let fixture: ComponentFixture<TransferBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
