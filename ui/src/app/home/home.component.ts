import {Component, HostListener, inject, signal} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'jdm-home',
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  router=inject(Router)
  fb=inject(FormBuilder)
  form: FormGroup=this.fb.group({
    chat: [''],
  })

  mouseX = signal(50);
  mouseY = signal(50);
  trackMouse = signal(true);

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
