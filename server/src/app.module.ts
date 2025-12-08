/**
 * Main Application Module
 * Integrates NestJS with Colyseus game server
 */
import { Module } from '@nestjs/common'
import { GameModule } from './game/game.module'

@Module({
  imports: [GameModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
