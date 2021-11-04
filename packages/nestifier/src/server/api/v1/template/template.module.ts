import {forwardRef, Module} from '@nestjs/common';
import { TemplateService } from './template.service';
import { TemplateController } from './template.controller';
import {SharedModule} from '@server-shared/shared.module';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Template} from '@server-entities/Template';
import {CoreModule} from '@server-core/core.module';


@Module({
  providers: [TemplateService],
  controllers: [TemplateController],
  imports: [
    TypeOrmModule.forFeature([Template]),
    forwardRef(() => CoreModule),
    SharedModule
  ],
  exports: [TemplateService]
})
export class TemplateModule {}
