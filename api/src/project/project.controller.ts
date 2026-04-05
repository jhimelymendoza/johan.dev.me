import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { ProjectDto } from './project.dto';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects', description: 'Returns the full list of projects ordered by year.' })
  @ApiResponse({ status: 200, description: 'List of projects', type: [ProjectDto] })
  findAll(): Promise<ProjectDto[]> {
    return this.projectService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id' })
  @ApiParam({ name: 'id', description: 'Project id' })
  @ApiResponse({ status: 200, description: 'Project found', type: ProjectDto })
  @ApiResponse({ status: 404, description: 'Project not found' })
  findById(@Param('id') id: string): Promise<ProjectDto> {
    return this.projectService.findById(id);
  }
}