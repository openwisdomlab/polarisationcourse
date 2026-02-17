import { IsOptional, IsString, IsIn } from 'class-validator'

export class UpdateLabDto {
  @IsOptional()
  @IsString()
  @IsIn(['not-started', 'in-progress', 'completed'])
  status?: string

  @IsOptional()
  dataJson?: Record<string, unknown>

  @IsOptional()
  fitJson?: Record<string, unknown>

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  skills?: Record<string, number>
}
