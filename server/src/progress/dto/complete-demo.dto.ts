import { IsOptional, IsString, IsIn } from 'class-validator'

export class CompleteDemoDto {
  @IsOptional()
  @IsString()
  @IsIn(['foundation', 'application', 'research'])
  difficulty?: string
}
