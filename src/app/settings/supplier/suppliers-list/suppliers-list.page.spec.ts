import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SuppliersListPage } from './suppliers-list.page';

describe('SuppliersListPage', () => {
  let component: SuppliersListPage;
  let fixture: ComponentFixture<SuppliersListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuppliersListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SuppliersListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
