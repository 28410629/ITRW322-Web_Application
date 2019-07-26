import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveConversationsComponent } from './active-conversations.component';

describe('ActiveConversationsComponent', () => {
  let component: ActiveConversationsComponent;
  let fixture: ComponentFixture<ActiveConversationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveConversationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveConversationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
