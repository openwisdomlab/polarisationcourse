import { IsOptional } from 'class-validator'

export class SaveGameDto {
  @IsOptional()
  stateJson?: Record<string, unknown>
}
