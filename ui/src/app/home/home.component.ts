import {Component, HostListener, inject, OnInit, signal} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TerminalComponent} from '../terminal/terminal.component';

@Component({
  selector: 'jdm-home',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    TerminalComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  router = inject(Router);
  private route = inject(ActivatedRoute);
  fb = inject(FormBuilder);
  form: FormGroup = this.fb.group({ chat: [''] });

  mouseX = signal(50);
  mouseY = signal(50);
  trackMouse = signal(true);
  showTerminal = signal(false);

  ngOnInit(): void {
    const panel = this.route.snapshot.queryParamMap.get('panel');
    if (panel === '1') this.showTerminal.set(true);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.trackMouse()) return;
    this.mouseX.set((e.clientX / window.innerWidth) * 100);
    this.mouseY.set((e.clientY / window.innerHeight) * 100);
  }

  toggleTracking() {
    this.trackMouse.set(!this.trackMouse());
  }

  ask() {
    const q = this.form.get('chat')?.value?.trim();
    if (q) {
      this.router.navigate(['chat'], { queryParams: { q } });
    } else {
      this.router.navigate(['chat']);
    }
  }
}
