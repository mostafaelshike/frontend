import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatproductComponent } from './updatproduct.component';

describe('UpdatproductComponent', () => {
  let component: UpdatproductComponent;
  let fixture: ComponentFixture<UpdatproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdatproductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdatproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
