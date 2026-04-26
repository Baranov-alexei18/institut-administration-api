import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import YAML from 'yaml';
import { AppModule } from '../app.module';

async function generate() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
  });

  const config = new DocumentBuilder()
    .setTitle('Institut Administration API')
    .setDescription('Auto generated OpenAPI spec')
    .setVersion('1.0')
    .build();

  app.setGlobalPrefix('api/v1');

  const document = SwaggerModule.createDocument(app, config);

  const yaml = YAML.stringify(document);

  writeFileSync('./spec/openapi.yaml', yaml, { encoding: 'utf8' });

  await app.close();

  console.log('✅ openapi.yaml generated');
}

generate();
