import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatAcountComponent } from './creat-acount.component';

describe('CreatAcountComponent', () => {
  let component: CreatAcountComponent;
  let fixture: ComponentFixture<CreatAcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatAcountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatAcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
