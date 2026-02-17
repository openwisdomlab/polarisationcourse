import { IsString, IsOptional } from 'class-validator'

export class UnlockDiscoveryDto {
  @IsString()
  discoveryId: string

  @IsOptional()
  @IsString()
  discoveredIn?: string
}
