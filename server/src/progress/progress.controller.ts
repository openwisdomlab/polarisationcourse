import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common'
import { ProgressService } from './progress.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { CompleteDemoDto } from './dto/complete-demo.dto'
import { UnlockDiscoveryDto } from './dto/unlock-discovery.dto'
import { SaveGameDto } from './dto/save-game.dto'
import { UpdateLabDto } from './dto/update-lab.dto'
import { SyncDto } from './dto/sync.dto'

type AuthRequest = { user: { userId: string } }

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  // --- Demos ---

  @Get('demos')
  getDemos(@Request() req: AuthRequest) {
    return this.progressService.getDemos(req.user.userId)
  }

  @Post('demos/:demoId/complete')
  completeDemo(
    @Request() req: AuthRequest,
    @Param('demoId') demoId: string,
    @Body() dto: CompleteDemoDto,
  ) {
    return this.progressService.completeDemo(req.user.userId, demoId, dto.difficulty)
  }

  // --- Discoveries ---

  @Get('discoveries')
  getDiscoveries(@Request() req: AuthRequest) {
    return this.progressService.getDiscoveries(req.user.userId)
  }

  @Post('discoveries/unlock')
  unlockDiscovery(@Request() req: AuthRequest, @Body() dto: UnlockDiscoveryDto) {
    return this.progressService.unlockDiscovery(
      req.user.userId,
      dto.discoveryId,
      dto.discoveredIn,
    )
  }

  // --- Game Saves ---

  @Get('games/:gameType')
  getGameSaves(@Request() req: AuthRequest, @Param('gameType') gameType: string) {
    return this.progressService.getGameSaves(req.user.userId, gameType)
  }

  @Post('games/:gameType/:level')
  saveGame(
    @Request() req: AuthRequest,
    @Param('gameType') gameType: string,
    @Param('level', ParseIntPipe) level: number,
    @Body() dto: SaveGameDto,
  ) {
    return this.progressService.saveGame(req.user.userId, gameType, level, dto.stateJson)
  }

  // --- Lab Progress ---

  @Get('lab')
  getLabProgress(@Request() req: AuthRequest) {
    return this.progressService.getLabProgress(req.user.userId)
  }

  @Post('lab/:taskId')
  updateLabTask(
    @Request() req: AuthRequest,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateLabDto,
  ) {
    return this.progressService.updateLabTask(req.user.userId, taskId, dto)
  }

  // --- Bulk Sync ---

  @Post('sync')
  sync(@Request() req: AuthRequest, @Body() dto: SyncDto) {
    return this.progressService.syncAll(req.user.userId, dto)
  }

  // --- Full Progress Snapshot ---

  @Get('full')
  getFullProgress(@Request() req: AuthRequest) {
    return this.progressService.getFullProgress(req.user.userId)
  }
}
