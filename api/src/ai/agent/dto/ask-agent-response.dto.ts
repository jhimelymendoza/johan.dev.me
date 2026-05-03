import { ApiProperty } from '@nestjs/swagger';

export class AskAgentResponseDto {
  @ApiProperty({ description: 'The agent response' })
  response: string;
}
