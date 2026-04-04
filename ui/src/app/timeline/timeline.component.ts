import { Component, AfterViewInit, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { RouterLink } from '@angular/router';

interface TimelineEntry {
  company: string;
  year: string;
  role: string;
  front?: string;
  back?: string;
  devops?: string;
  methodology?: string;
}

@Component({
  selector: 'jdm-timeline',
  imports: [RouterLink],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
})
export class TimelineComponent implements AfterViewInit {

  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  @ViewChildren('entry') entries!: QueryList<ElementRef>;

  timelineData: TimelineEntry[] = [
    {
      company: 'Aysa Risk',
      year: '2025',
      role: 'Jefe Técnico de Software',
      front: 'Angular 13, Ant-design, Git, Git Conventionals, Husky-git, standar-version, Prettier, Eslint, Figma',
      back: '.Net 6, Web Api, Entity Frameworks 6, Oracle, N-Layer architecture',
      devops: 'Azure Devops, Docker',
      methodology: 'Scrum',
    },
    {
      company: 'Fibertel Ecommerce',
      year: '2024',
      role: 'Jefe Técnico de Software',
      front: 'Angular 13, Ant-design, Git, Git Conventionals, Husky-git, standar-version, Prettier, Eslint, Figma',
      back: '.Net 6, Web Api, Entity Frameworks 6, Oracle, N-Layer architecture',
      devops: 'Azure Devops, Docker',
      methodology: 'Scrum',
    },
    {
      company: 'Aerolíneas Argentinas',
      year: '2023',
      role: 'Jefe Técnico de Software',
      front: 'Angular 13, Ant-design, Git, Git Conventionals, Husky-git, standar-version, Prettier, Eslint, Figma',
      back: '.Net 6, Web Api, Entity Frameworks 6, Oracle, N-Layer architecture',
      devops: 'Azure Devops, Docker',
      methodology: 'Scrum',
    },
    {
      company: 'Hospital Universitario Astral',
      year: '2022',
      role: 'Jefe Técnico de Software',
      front: 'Angular 13, Ant-design, Git, Git Conventionals, Husky-git, standar-version, Prettier, Eslint, Figma',
      back: '.Net 6, Web Api, Entity Frameworks 6, Oracle, N-Layer architecture',
      devops: 'Azure Devops, Docker',
      methodology: 'Scrum',
    },
    {
      company: 'Banco Nación',
      year: '2021',
      role: 'Desarrollador Fullstack Senior',
      front: 'React, Redux, Styled Components, Figma',
      back: 'Node.js, Express, PostgreSQL, REST APIs',
      devops: 'Jenkins, Kubernetes',
      methodology: 'Kanban',
    },
    {
      company: 'Globant',
      year: '2020',
      role: 'Desarrollador Fullstack',
      front: 'Angular, TypeScript, SCSS, Figma',
      back: 'Java Spring Boot, MySQL, Microservices',
      devops: 'AWS, Docker, GitLab CI',
      methodology: 'Scrum',
    },
    {
      company: 'MercadoLibre',
      year: '2019',
      role: 'Desarrollador Frontend',
      front: 'React, JavaScript, CSS Modules',
      back: 'Node.js, MongoDB',
      devops: 'CircleCI, AWS',
      methodology: 'Scrum',
    },
    {
      company: 'Accenture',
      year: '2018',
      role: 'Desarrollador Junior',
      front: 'Angular 2+, Bootstrap, JavaScript',
      back: '.Net Core, SQL Server',
      devops: 'Azure DevOps',
      methodology: 'Scrum',
    },
  ];

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    this.entries.forEach((ref) => observer.observe(ref.nativeElement));
  }
}
