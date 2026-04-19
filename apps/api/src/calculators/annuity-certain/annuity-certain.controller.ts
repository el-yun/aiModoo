import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { AnnuityCertainService } from './annuity-certain.service';
import { AnnuityCertainRequestDto } from './annuity-certain.dto';

@ApiTags('calculators')
@Controller('calculators')
export class AnnuityCertainController {
  constructor(private readonly service: AnnuityCertainService) {}

  @Post('annuity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '유기정기금 현재가치 계산' })
  @ApiResponse({ status: 200, description: '계산 성공' })
  @ApiResponse({ status: 400, description: '유효성 검사 실패' })
  calculate(@Body() dto: AnnuityCertainRequestDto) {
    return this.service.calculate(dto);
  }
}
