import { plainToInstance, Type } from 'class-transformer'
import { IsString, IsNumber, IsOptional, validateSync } from 'class-validator'

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string

  @IsString()
  JWT_SECRET: string

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  PORT: number = 3001

  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:5173,http://localhost:3000'
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  })
  const errors = validateSync(validatedConfig, { skipMissingProperties: false })
  if (errors.length > 0) {
    throw new Error(`Configuration validation error: ${errors.toString()}`)
  }
  return validatedConfig
}
