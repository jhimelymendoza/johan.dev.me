import { ApiProperty } from '@nestjs/swagger';

export class AskAgentDto {
  @ApiProperty({ description: 'The question or query to send to the agent' })
  query: string;
}
