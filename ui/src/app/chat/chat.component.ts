import { Component } from '@angular/core';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'jdm-chat',
  imports: [
    RouterLink
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {

  adjustHeight(textarea: HTMLTextAreaElement): void {
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || '20');
    const maxHeight = lineHeight * 8;

    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;

    if (scrollHeight <= maxHeight) {
      textarea.style.height = scrollHeight + 'px';
      textarea.style.overflowY = 'hidden';
    } else {
      textarea.style.height = maxHeight + 'px';
      textarea.style.overflowY = 'auto';
    }
  }

}
