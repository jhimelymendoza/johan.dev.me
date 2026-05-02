import { ApiProperty } from '@nestjs/swagger';

export class AiConfigDto {
  @ApiProperty({ description: 'Active AI provider name' })
  provider: string;

  @ApiProperty({ description: 'Chat model used for responses' })
  chatModel: string;

  @ApiProperty({ description: 'Embedding model used for semantic search' })
  embeddingModel: string;
}
