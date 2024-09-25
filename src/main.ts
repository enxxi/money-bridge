import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe, Logger } from '@nestjs/common'
import { setupSwagger } from './common/swagger'
import { winstonLogger } from './common/winston.logger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {})

  app.enableCors({ origin: 'http://localhost:3000', credentials: true })

  setupSwagger(app)
  app.useLogger(winstonLogger)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      skipMissingProperties: true,
    }),
  )

  const configService = app.get(ConfigService)
  const port = configService.get('PORT') || 3000
  await app.listen(port)
  Logger.log(`Application running on port ${port}`)
}
bootstrap()
