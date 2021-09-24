import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CustomersListPage } from './customers-list.page';

describe('CustomersListPage', () => {
  let component: CustomersListPage;
  let fixture: ComponentFixture<CustomersListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomersListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomersListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
