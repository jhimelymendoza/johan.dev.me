import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project, ProjectDocument } from './project.schema';
import { ProjectDto } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
  ) {}

  async findAll(): Promise<ProjectDto[]> {
    const projects = await this.projectModel.find().exec();
    return projects.map((p) => this.toDto(p));
  }

  async findById(id: string): Promise<ProjectDto> {
    const project = await this.projectModel.findById(id).exec();
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return this.toDto(project);
  }

  async setEmbeddings(id: string, embeddings: number[]): Promise<ProjectDto> {
    const project = await this.projectModel
      .findByIdAndUpdate(id, { embeddings }, { new: true })
      .exec();
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return this.toDto(project);
  }

  private toDto(project: ProjectDocument): ProjectDto {
    return {
      id: project._id.toString(),
      company: project.company,
      year: project.year,
      role: project.role,
      description: project.description,
      ...(project.front && { front: project.front }),
      ...(project.back && { back: project.back }),
      ...(project.devops && { devops: project.devops }),
      ...(project.methodology && { methodology: project.methodology }),
    };
  }
}
