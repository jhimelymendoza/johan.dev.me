import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'jdm-home',
  imports: [
    ReactiveFormsModule
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
    this.router.navigate(['chat']);
  }
}
