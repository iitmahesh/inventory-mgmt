import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddPurchasePage } from './add-purchase.page';

describe('AddPurchasePage', () => {
  let component: AddPurchasePage;
  let fixture: ComponentFixture<AddPurchasePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPurchasePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddPurchasePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
