import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  inject,
  Inject,
  Input,
  OnInit,
  Output,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

interface TermLine {
  html: SafeHtml;
}

@Component({
  selector: 'jdm-terminal',
  imports: [FormsModule],
  templateUrl: './terminal.component.html',
  styleUrl: './terminal.component.scss',
  host: { '[class.term-host--fullscreen]': 'mode === "fullscreen"' },
})
export class TerminalComponent implements OnInit, AfterViewInit {
  @Input() mode: 'panel' | 'fullscreen' = 'panel';
  @Output() closePanel = new EventEmitter<void>();

  @ViewChild('termInput') termInput!: ElementRef<HTMLInputElement>;
  @ViewChild('termBody')  termBody!:  ElementRef<HTMLDivElement>;

  private router    = inject(Router);
  private route     = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  lines: TermLine[] = [];
  currentInput = '';
  private cmdHistory: string[] = [];
  private histIdx = -1;

  // ─── Lifecycle ──────────────────────────────────────────────────
  ngOnInit(): void {
    const routeMode = this.route.snapshot.data['mode'];
    if (routeMode) this.mode = routeMode;
    this.printWelcome();
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.termInput?.nativeElement.focus());
    }
  }

  // ─── Output helpers ─────────────────────────────────────────────
  private safe(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private push(html: string): void {
    this.lines.push({ html: this.safe(html) });
    setTimeout(() => {
      const el = this.termBody?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }

  private esc(s: string): string {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/ /g, '&nbsp;');
  }

  // ─── Welcome ────────────────────────────────────────────────────
  private printWelcome(): void {
    const art = [
      `     _       _                     _           `,
      `    | | ___  | |__   __ _ _ __   __| | _____   __`,
      ` _  | |/ _ \\ | '_ \\ / _\` | '_ \\ / _\` |/ _ \\ \\/ /`,
      `| |_| | (_) || | | || (_| || | | || (_| ||  __/ v `,
      ` \\___/ \\___/ |_| |_|\\__,_||_| |_|\\__,_|\\___|\\_/  .me`,
    ];
    art.forEach(l => this.push(`<span class="c-brand">${this.esc(l)}</span>`));
    this.push('');
    this.push(`<span class="c-dim">&gt;&nbsp;¿Qué quieres <span class="c-hl">explorar</span> hoy?</span>`);
    this.push(`<span class="c-dim">Escribe <span class="c-cmd">ayuda</span> para ver los comandos disponibles.</span>`);
    this.push('');
  }

  // ─── Input handling ─────────────────────────────────────────────
  onBodyClick(): void {
    this.termInput?.nativeElement.focus();
  }

  onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      const cmd = this.currentInput.trim();
      this.push(
        `<span class="c-prompt">johandev@portfolio:~$</span>&nbsp;<span class="c-input">${this.esc(cmd)}</span>`
      );
      if (cmd) {
        this.cmdHistory.unshift(cmd);
        this.histIdx = -1;
        this.execCommand(cmd.toLowerCase());
      }
      this.currentInput = '';

    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.histIdx < this.cmdHistory.length - 1) {
        this.histIdx++;
        this.currentInput = this.cmdHistory[this.histIdx];
      }

    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.histIdx > 0) {
        this.histIdx--;
        this.currentInput = this.cmdHistory[this.histIdx];
      } else {
        this.histIdx = -1;
        this.currentInput = '';
      }
    }
  }

  // ─── Command dispatcher ─────────────────────────────────────────
  private execCommand(cmd: string): void {
    const map: Record<string, () => void> = {
      ayuda:        () => this.cmdHelp(),
      help:         () => this.cmdHelp(),
      'sobre-mi':   () => this.cmdAbout(),
      about:        () => this.cmdAbout(),
      habilidades:  () => this.cmdSkills(),
      skills:       () => this.cmdSkills(),
      proyectos:    () => this.cmdProjects(),
      projects:     () => this.cmdProjects(),
      contacto:     () => this.cmdContact(),
      contact:      () => this.cmdContact(),
      chat:         () => this.router.navigate(['/chat']),
      timeline:     () => this.router.navigate(['/timeline']),
      home:         () => this.router.navigate(['/home']),
      clear:        () => { this.lines = []; },
      limpiar:      () => { this.lines = []; },
    };

    const fn = map[cmd];
    if (fn) {
      fn();
    } else {
      this.push(
        `<span class="c-error">bash: ${this.esc(cmd)}: comando no encontrado</span>&nbsp;` +
        `<span class="c-dim">— escribe <span class="c-cmd">ayuda</span></span>`
      );
    }
    this.push('');
  }

  // ─── Commands ───────────────────────────────────────────────────
  private cmdHelp(): void {
    const cmds: [string, string][] = [
      ['sobre-mi',    ' [Quién soy y mi experiencia]'],
      ['habilidades', ' [Mi stack técnico]'],
      ['proyectos',   ' [Proyectos destacados]'],
      ['contacto',    ' [Formas de contactarme]'],
      ['chat',        ' [Abrir chat con IA]'],
      ['timeline',    ' [Ver timeline de carrera]'],
      ['home',        ' [Volver al inicio]'],
      ['clear',       ' [Limpiar la terminal]'],
    ];
    this.push('<span class="c-dim">Comandos disponibles:</span>');
    cmds.forEach(([c, d]) =>
      this.push(`&nbsp;&nbsp;<span class="c-cmd">${c}</span><span class="c-dim c-pad">${d}</span>`)
    );
  }

  private cmdAbout(): void {
    this.push('<span class="c-hl">Johan Mendoza</span> <span class="c-dim">— Desarrollador Fullstack Senior</span>');
    this.push('');
    this.push('<span class="c-dim">+8 años construyendo productos digitales desde Argentina.</span>');
    this.push('<span class="c-dim">Especializado en Angular, .NET y arquitecturas cloud-native</span>');
    this.push('<span class="c-dim">con foco en experiencia de usuario y calidad de código.</span>');
  }

  private cmdSkills(): void {
    this.push('<span class="c-dim">Stack técnico:</span>');
    this.push('');
    this.push('&nbsp;&nbsp;<span class="c-tag">Frontend</span>&nbsp;&nbsp;Angular · React · TypeScript · SCSS');
    this.push('&nbsp;&nbsp;<span class="c-tag">Backend</span>&nbsp;&nbsp;&nbsp;.NET · NestJS · Node.js · REST');
    this.push('&nbsp;&nbsp;<span class="c-tag">Data</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;MongoDB · PostgreSQL · Oracle · Redis');
    this.push('&nbsp;&nbsp;<span class="c-tag">DevOps</span>&nbsp;&nbsp;&nbsp;Docker · Azure · AWS · Kubernetes');
  }

  private cmdProjects(): void {
    this.push('<span class="c-dim">Proyectos destacados:</span>');
    this.push('');
    this.push('&nbsp;&nbsp;<span class="c-hl">johandev.me</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-dim">Portfolio + AI chat (Angular + NestJS)</span>');
    this.push('&nbsp;&nbsp;<span class="c-hl">Fibertel</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-dim">E-commerce platform (.NET + Angular)</span>');
    this.push('&nbsp;&nbsp;<span class="c-hl">Aerolíneas</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-dim">Sistemas internos (.NET + Azure)</span>');
    this.push('');
    this.push(`<span class="c-dim">&nbsp;&nbsp;Escribe <span class="c-cmd">timeline</span> para ver la historia completa.</span>`);
  }

  private cmdContact(): void {
    this.push('<span class="c-dim">Formas de contacto:</span>');
    this.push('');
    this.push('&nbsp;&nbsp;<span class="c-tag">GitHub</span>&nbsp;&nbsp;&nbsp;<span class="c-hl">github.com/johandev</span>');
    this.push('&nbsp;&nbsp;<span class="c-tag">LinkedIn</span>&nbsp;<span class="c-hl">linkedin.com/in/johandev</span>');
    this.push('&nbsp;&nbsp;<span class="c-tag">Email</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="c-hl">hi@johandev.me</span>');
  }

  // ─── Window controls ────────────────────────────────────────────
  onRed(): void {
    if (this.mode === 'fullscreen') {
      this.router.navigate(['/home']);
    } else {
      this.closePanel.emit();
    }
  }

  onYellow(): void {
    this.router.navigate(['/terminal']);
  }

  onGreen(): void {
    if (this.mode === 'fullscreen') {
      this.router.navigate(['/home'], { queryParams: { panel: '1' } });
    }
  }
}
