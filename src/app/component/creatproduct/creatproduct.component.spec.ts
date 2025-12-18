import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatproductComponent } from './creatproduct.component';

describe('CreatproductComponent', () => {
  let component: CreatproductComponent;
  let fixture: ComponentFixture<CreatproductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatproductComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatproductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
