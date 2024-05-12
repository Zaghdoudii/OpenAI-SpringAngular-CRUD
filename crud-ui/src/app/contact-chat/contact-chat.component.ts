import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ChatService } from './chat.service';


@Component({
  selector: 'app-contact-chat',
  templateUrl: './contact-chat.component.html',
  styleUrls: ['./contact-chat.component.css']
})
export class ContactChatComponent implements OnInit {

  messages: { user: string, content: string }[] = [
    { user: 'bot', content: 'How can I assist you today !' },
    { user: 'bot', content: 'Hello' }
  ];
  queryFormGroup!: FormGroup;
  isFullScreen: boolean = false;


  @Input()
  showWidget:any;

  @Output()
  closeWidgetEmitted = new EventEmitter();

  constructor(private fb: FormBuilder, private chatService: ChatService) { }

  toggleFullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }

  ngOnInit() {
    this.queryFormGroup = this.fb.group({ query: this.fb.control("") });
    const storedConversation = sessionStorage.getItem('conversation');
    if (storedConversation) {
      this.messages = JSON.parse(storedConversation);
    }

    this.showWidget = true;
  }

  emitCloseWidget() {
    this.closeWidgetEmitted.emit();
    this.showWidget = false;
  }

  updateSessionStorage() {
    sessionStorage.setItem('conversation', JSON.stringify(this.messages));
  }

  handleAskGPT() {
    const userMessage = this.queryFormGroup.get('query')?.value;
    this.messages.unshift({ user: 'user', content: userMessage });
    this.updateSessionStorage();

    this.chatService.chat(userMessage).subscribe(
      response => {
        this.messages.unshift({ user: 'bot', content: response.response });
        this.updateSessionStorage();
      }, error => {
        console.error('Error sending message:', error);
      });
    this.queryFormGroup.reset();
  }

  formatText(line: string): string {
    const regex = /"([^"]+)"/g;
    return line.replace(regex, '<strong>$1</strong>');
  }
}