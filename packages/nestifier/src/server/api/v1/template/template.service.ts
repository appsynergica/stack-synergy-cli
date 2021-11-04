import {Injectable, Logger} from '@nestjs/common';
import {DeepPartial, Repository} from 'typeorm';
import {ObjectSchema, SchemaMap} from 'joi';
import {AppRequestOrigin} from '@desmondrg/cornerstone-node';
import {AppDao, AppSchemaType, AppSchemaValidationType, IJoinRelation} from '@desmondrg/filebase-node';
import {AppSearchOptions} from '@desmondrg/cornerstone-node';
import {fxnPrettyJsonApi} from '@desmondrg/cornerstone-node';
import _ from 'lodash';
import Joi from 'joi';
import {QueryDeepPartialEntity} from 'typeorm/query-builder/QueryPartialEntity';
import {Template} from '@server-entities/Template';
import {AppLogger} from '@server-shared/loggers/app-logger/app-logger';
import {InjectRepository} from '@nestjs/typeorm';
import {RoleType} from '@app-dynamic';

@Injectable()
export class TemplateService extends AppDao<Template, AppSearchOptions, AppSchemaType, RoleType>
{

  constructor(protected logger: AppLogger,
              @InjectRepository(Template)
              public repository: Repository<Template>)
  {
    super(repository, ['name'], logger, AppSchemaValidationType.classValidator);

    this.logger.setContext(TemplateService.name);

  }


  hideSensitiveInfo(obj: Template)
  {
    super.hideSensitiveInfo(obj);

    // delete any additional sensitive info here
    // e.g : delete user.password;
  }

  removeUnfillableInfo(obj: DeepPartial<Template> | QueryDeepPartialEntity<Template>): DeepPartial<Template> | QueryDeepPartialEntity<Template>
  {
    obj = super.removeUnfillableInfo(obj);

    // delete any additional unfillable information here

    delete obj.id; // Rationale: Updating an object's id overwrites the object in the database, therefore delete this id unless you want to overwrite the object

    return obj;
  }


  async addObject(args: DeepPartial<Template>,
                  reqOrigin: AppRequestOrigin,
                  loadedRelations: Array<string | IJoinRelation>): Promise<Template>
  {

    this.logger.verbose(`addObject -> called with partial template : ${fxnPrettyJsonApi(args)}`);

    // modify the Template's args before passing it to the fxn that inserts it into the database
    args.name = _.upperFirst(args.name);

    const template = await super.addObject(args, reqOrigin, loadedRelations);

    this.logger.verbose(`addObject -> partial template resulted in new obj : ${fxnPrettyJsonApi(template)}`);

    return template;

  }

  getSchemaMap(schemaType: AppSchemaType, reqOrigin: AppRequestOrigin): SchemaMap<any>
  {
    const isInternalReq = reqOrigin === AppRequestOrigin.internal;

    switch (schemaType.rawValue)
    {
      case AppSchemaType.addObject.rawValue:
        const schemaMap: any = {
          name: Joi.string().required()
        };

        if (reqOrigin === AppRequestOrigin.internal)
        {
          schemaMap.id = Joi.number().positive().allow(0);
        }
        return schemaMap;

      case AppSchemaType.updateObject.rawValue:
        return {};

    }
  }

  getSchemaObject(schemaType: AppSchemaType, reqOrigin: AppRequestOrigin): ObjectSchema<any>
  {
    switch (reqOrigin)
    {
      case AppRequestOrigin.external:
        return Joi.object(this.getSchemaMap(schemaType, reqOrigin)).unknown(false);

      case AppRequestOrigin.internal:
        return Joi.object(this.getSchemaMap(schemaType, reqOrigin)).unknown(true);

    }
  }
}
