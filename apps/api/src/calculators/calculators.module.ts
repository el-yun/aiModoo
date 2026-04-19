import { Module } from '@nestjs/common';
import { AnnuityCertainController } from './annuity-certain/annuity-certain.controller';
import { AnnuityCertainService } from './annuity-certain/annuity-certain.service';

@Module({
  controllers: [AnnuityCertainController],
  providers: [AnnuityCertainService],
})
export class CalculatorsModule {}
