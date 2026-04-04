import {Component, inject} from '@angular/core';
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

  ask() {
    const q = this.form.get('chat')?.value?.trim();
    if (q) {
      this.router.navigate(['chat'], { queryParams: { q } });
    } else {
      this.router.navigate(['chat']);
    }
  }
}
