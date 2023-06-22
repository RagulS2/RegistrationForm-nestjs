import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifyviaotpComponent } from './verifyviaotp.component';

describe('VerifyviaotpComponent', () => {
  let component: VerifyviaotpComponent;
  let fixture: ComponentFixture<VerifyviaotpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VerifyviaotpComponent]
    });
    fixture = TestBed.createComponent(VerifyviaotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
