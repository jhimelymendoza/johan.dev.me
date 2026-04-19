import {AfterViewInit, Component, ElementRef, inject, Inject, OnInit, PLATFORM_ID, QueryList, ViewChildren} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {RouterLink} from '@angular/router';
import {TimelineEntry} from '../dto/timeline.interface';
import {TimelineService} from '../services/timeline.service';

@Component({
  selector: 'jdm-timeline',
  imports: [RouterLink],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements AfterViewInit, OnInit {

  @ViewChildren('entry') entries!: QueryList<ElementRef>;

  private platformId = inject(PLATFORM_ID);
  private timelineService = inject(TimelineService);

  timelineData: TimelineEntry[] = [];
  loading = true;
  error = '';

  ngOnInit() {
    this.timelineService.getProjects().subscribe({
      next: (data) => {
        this.timelineData = data;
        console.log(this.timelineData);
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar los proyectos';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.setupObserver());
  }

  onDotClick(event: MouseEvent): void {
    const dot = (event.currentTarget as HTMLElement);
    dot.classList.remove('burst');
    void dot.offsetWidth;
    dot.classList.add('burst');
    dot.addEventListener('animationend', () => dot.classList.remove('burst'), { once: true });
  }

  private setupObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    this.entries.forEach((ref) => observer.observe(ref.nativeElement));
  }
}
