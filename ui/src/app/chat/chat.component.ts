import {AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {IChat, IHistory} from '../dto/chat.interface';
import {NgClass} from '@angular/common';
import {ChatService} from '../services/chat.service';
import {AiConfigService} from '../services/ai-config.service';
import {finalize, of} from 'rxjs';
import {typewriter} from '../operators/typewriter.operator';

@Component({
  selector: 'jdm-chat',
  imports: [
    RouterLink,
    FormsModule,
    NgClass

  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  providers: [ChatService]
})
export class ChatComponent implements AfterViewChecked, OnInit {

  chatService=inject(ChatService)
  aiConfigService=inject(AiConfigService)
  private route=inject(ActivatedRoute)
  histories: IHistory[]=[

  ];

  question='';
  loading = false;

  aiConfig = this.aiConfigService.config;
  aiLoading = this.aiConfigService.loading;

  @ViewChild('chatHistory') chatHistory!: ElementRef<HTMLDivElement>;


  ngOnInit(): void {
    this.aiConfigService.fetchConfig();
    const q = this.route.snapshot.queryParamMap.get('q');
    if (q) {
      this.question = q;
      this.send();
    }
  }

  adjustHeight(textarea: HTMLTextAreaElement): void {
    const lineHeight = parseFloat(getComputedStyle(textarea).lineHeight || '15');
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



  send() {
    if(this.loading) return
    const savedQuestion=`${this.question}`
    this.histories=[...this.histories,{ message:this.question,bot:false,user:true}];

    setTimeout(() => {
      this.question='';
    })

    this.loading=true;
    this.chatService.ask(savedQuestion).pipe(finalize(()=>{
      this.loading=false;
    })).subscribe((response:IChat)=>{
      this.typewriterEffect(response.answer);
    })

  }

  typewriterEffect(fullText: string): void {
    const entry: IHistory = { message: '', bot: true, user: false, typing: true };
    this.histories = [...this.histories, entry];

    of(fullText).pipe(typewriter()).subscribe({
      next: (partial) => entry.message = partial,
      complete: () => entry.typing = false,
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.chatHistory?.nativeElement) {
      this.chatHistory.nativeElement.scrollTop = this.chatHistory.nativeElement.scrollHeight;
    }
  }
}
