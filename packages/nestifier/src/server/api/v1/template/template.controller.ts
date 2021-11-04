import {Controller, Delete, Get, Next, Post, Put, Req, Res, UseGuards} from '@nestjs/common';
import {AppController, AppSchemaType} from '@desmondrg/filebase-node';
import {Template} from '@server-entities/Template';
import {AppSearchOptions} from '@desmondrg/cornerstone-node';
import {RoleType, AppResourceType} from '@app-dynamic';
import {TemplateService} from '@server/api/v1/template/template.service';
import {NextFunction, Request, Response} from 'express';
import {ServerAccessControlService} from '@server-core/auth/services/server-access-control/server-access-control.service';
import {JwtAuthGuard} from '@server-core/auth/guards/jwt-auth/jwt-auth.guard';
import {Public} from '@server-core/auth/decorators/public.decorator';
import {User} from '@server-entities/User';

@UseGuards(JwtAuthGuard)
@Controller('templates')
export class TemplateController  extends AppController<Template, AppSearchOptions, AppResourceType, AppSchemaType, TemplateService, RoleType>
{
  constructor(public dao: TemplateService,
              public serverAccessControlService: ServerAccessControlService)
  {
    super(serverAccessControlService, AppResourceType.Template, dao);
  }

  @Public()
  @Get()
  async getAllObjects(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<Response<any>>
  {
    return super.getAllObjects(req, res, next);
  }

  @Public()
  @Get(':id')
  async getObject(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<Response<any>>
  {
    return super.getObject(req, res, next);
  }

  @Post()
  async addObject(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<Response<any>>
  {
    return super.addObject(req, res, next);
  }

  @Put(':id')
  async updateObject(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<Response<any>>
  {
    return super.updateObject(req, res, next);
  }

  @Delete(':id')
  async deleteObject(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction): Promise<Response<any>>
  {
    return super.deleteObject(req, res, next);
  }


}
