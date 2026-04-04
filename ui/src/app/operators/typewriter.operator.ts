import { Observable, scan } from 'rxjs';

function charDelay(char: string): number {
  let delay = 18 + Math.random() * 20;
  if ('.!?'.includes(char)) delay += 120;
  else if (',;:'.includes(char)) delay += 50;
  return delay;
}

/**
 * RxJS operator that takes an Observable<string> emitting a full text
 * and re-emits it character by character, accumulating into a growing string.
 *
 * Usage:
 *   of(fullText).pipe(typewriter()).subscribe(partial => entry.message = partial);
 *
 * CSS: import 'typewriter.scss' in your component for the blinking cursor.
 * Add a <span class="cursor">|</span> next to the text while typing is active.
 */
export function typewriter() {
  return (source$: Observable<string>) =>
    new Observable<string>(subscriber => {
      let timeoutId: ReturnType<typeof setTimeout>;

      const sub = source$.subscribe({
        next: (text) => {
          let i = 0;

          const type = () => {
            if (i >= text.length) {
              subscriber.complete();
              return;
            }
            const char = text[i++];
            subscriber.next(char);
            timeoutId = setTimeout(type, charDelay(char));
          };

          type();
        },
        error: (err) => subscriber.error(err),
      });

      return () => {
        clearTimeout(timeoutId);
        sub.unsubscribe();
      };
    }).pipe(
      scan((acc, char) => acc + char, '')
    );
}