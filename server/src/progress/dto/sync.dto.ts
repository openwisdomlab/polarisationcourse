import { IsOptional, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'

class SyncDemoItem {
  demoId: string
  completed: boolean
  difficulty?: string
  completedAt?: string
}

class SyncDiscoveryItem {
  discoveryId: string
  discoveredIn?: string
  discoveredAt?: string
}

class SyncGameSaveItem {
  gameType: string
  level: number
  stateJson?: Record<string, unknown>
  savedAt?: string
}

class SyncLabItem {
  taskId: string
  status?: string
  dataJson?: Record<string, unknown>
  fitJson?: Record<string, unknown>
  notes?: string
  skills?: Record<string, number>
  startedAt?: string
  completedAt?: string
}

export class SyncDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncDemoItem)
  demos?: SyncDemoItem[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncDiscoveryItem)
  discoveries?: SyncDiscoveryItem[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncGameSaveItem)
  gameSaves?: SyncGameSaveItem[]

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SyncLabItem)
  labProgress?: SyncLabItem[]
}
