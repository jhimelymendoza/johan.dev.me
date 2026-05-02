import { ApiProperty } from '@nestjs/swagger';

export class EmbeddingConfigDto {
  @ApiProperty({ description: 'Active embedding provider name' })
  provider: string;

  @ApiProperty({ description: 'Embedding model in use' })
  embeddingModel: string;
}
