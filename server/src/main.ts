/**
 * PolarCraft Server Entry Point
 * NestJS + Colyseus for real-time multiplayer game server
 */
import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Enable CORS for frontend
  app.enableCors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })

  // Global validation pipe
  app.setGlobalPrefix('api')
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    })
  )

  const port = process.env.PORT || 3001
  await app.listen(port)
  console.log(`🚀 PolarCraft server running on http://localhost:${port}`)
  console.log(`🎮 Colyseus game server available at ws://localhost:${port}`)
}

bootstrap()
