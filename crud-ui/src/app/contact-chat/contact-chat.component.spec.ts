import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactChatComponent } from './contact-chat.component';

describe('ContactChatComponent', () => {
  let component: ContactChatComponent;
  let fixture: ComponentFixture<ContactChatComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContactChatComponent]
    });
    fixture = TestBed.createComponent(ContactChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
