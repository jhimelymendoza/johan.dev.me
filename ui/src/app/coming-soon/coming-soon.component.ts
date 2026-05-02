import {Component, inject, input, OnInit, signal} from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';

@Component({
  selector: 'jdm-coming-soon',
  imports: [RouterLink],
  templateUrl: './coming-soon.component.html',
  styleUrl: './coming-soon.component.scss'
})
export class ComingSoonComponent implements OnInit {
  private route = inject(ActivatedRoute);
  title = input<string>('Coming Soon');
  subtitle = input<string>('Esta página está en construcción');
  backUrl = input<string>('/home');

  displayTitle = signal('Coming Soon');
  displaySubtitle = signal('Esta página está en construcción');

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      if (params.get('title')) this.displayTitle.set(params.get('title')!);
      if (params.get('subtitle')) this.displaySubtitle.set(params.get('subtitle')!);
    });
  }
}