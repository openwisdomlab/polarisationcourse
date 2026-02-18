/**
 * PolarCraft Server Entry Point
 * NestJS + Colyseus for real-time multiplayer game server
 */
import { NestFactory } from '@nestjs/core'
import { ValidationPipe, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Request, Response, NextFunction } from 'express'
import { AppModule } from './app.module'
import { GlobalExceptionFilter } from './common/filters/http-exception.filter'
// TODO: Install helmet (`npm install helmet`) and uncomment the import below
// import helmet from 'helmet'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const configService = app.get(ConfigService)
  const logger = new Logger('HTTP')

  // TODO: Uncomment after installing helmet
  // app.use(helmet())

  // Simple request logger middleware
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.log(`${req.method} ${req.url}`)
    next()
  })

  // Configurable CORS origins from environment variable
  const corsOrigins = configService.get<string>(
    'CORS_ORIGINS',
    'http://localhost:5173,http://localhost:3000',
  )
  app.enableCors({
    origin: corsOrigins.split(',').map((origin) => origin.trim()),
    credentials: true,
  })

  // Global prefix for all API routes
  app.setGlobalPrefix('api')

  // Global validation pipe with strict settings
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )

  // Global exception filter for consistent error responses
  app.useGlobalFilters(new GlobalExceptionFilter())

  const port = configService.get<number>('PORT', 3001)
  await app.listen(port)
  console.log(`PolarCraft server running on http://localhost:${port}`)
  console.log(`Colyseus game server available at ws://localhost:${port}`)
}

bootstrap()
