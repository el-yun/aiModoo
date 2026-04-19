import { Module } from '@nestjs/common';
import { CalculatorsModule } from './calculators/calculators.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CalculatorsModule, HealthModule],
})
export class AppModule {}
