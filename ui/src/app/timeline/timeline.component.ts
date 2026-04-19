import {afterNextRender, Component, DestroyRef, ElementRef, inject, QueryList, signal, ViewChildren} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {RouterLink} from '@angular/router';
import {TimelineEntry} from '../dto/timeline.interface';
import {TimelineService} from '../services/timeline.service';

@Component({
  selector: 'jdm-timeline',
  imports: [RouterLink],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent {

  @ViewChildren('entry') entries!: QueryList<ElementRef>;

  private timelineService = inject(TimelineService);
  private destroyRef = inject(DestroyRef);
  private observer?: IntersectionObserver;

  timelineData = signal<TimelineEntry[]>([]);
  loading = signal(true);
  error = signal('');

  constructor() {
    this.timelineService.getProjects()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (data) => {
          this.timelineData.set(data);
          this.loading.set(false);
        },
        error: () => {
          this.error.set('Error al cargar los proyectos');
          this.loading.set(false);
        }
      });

    /**
     * Initializes the IntersectionObserver after the DOM is fully rendered and laid out.
     *
     * {@link afterNextRender} defers execution until Angular completes:
     * 1. Change detection and template rendering
     * 2. DOM updates committed to the browser
     * 3. Paint/layout computation
     *
     * This is essential for SSR hydration scenarios: browser geometry must be computed
     * before IntersectionObserver can detect initial viewport intersections. Without this delay,
     * SSR hydration mismatches cause elements to render but remain invisible (opacity: 0).
     *
     * Only runs in browser context, automatically skipped during server-side rendering.
     */
    afterNextRender(() => {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              this.observer?.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );

      this.scheduleObserveAll();

      this.entries.changes
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.scheduleObserveAll());
    });
  }

  onDotClick(event: MouseEvent): void {
    const dot = (event.currentTarget as HTMLElement);
    dot.classList.remove('burst');
    void dot.offsetWidth;
    dot.classList.add('burst');
    dot.addEventListener('animationend', () => dot.classList.remove('burst'), { once: true });
  }

  /**
   * Defers observation to the next animation frame so the browser has finished layout
   * (critical after SSR hydration, where elements exist but their geometry may not yet
   * be computed, causing IntersectionObserver to miss the initial intersection).
   */
  private scheduleObserveAll(): void {
    requestAnimationFrame(() => {
      this.entries.forEach((ref) => {
        const el = ref.nativeElement as HTMLElement;
        if (el && !el.classList.contains('visible')) {
          this.observer?.observe(el);
        }
      });
    });
  }
}