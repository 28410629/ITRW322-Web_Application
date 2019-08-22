import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadscreenComponent } from './loadscreen.component';

describe('LoadscreenComponent', () => {
  let component: LoadscreenComponent;
  let fixture: ComponentFixture<LoadscreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadscreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadscreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
