import {NameMaven} from '@appsynergica/common-cli';

export enum AppFileType
{
  module = 'module',
  controller = 'controller',
  service = 'service'
}

export enum ApiFileType
{
  module = 'module',
  controller = 'controller',
  service = 'service',
  resolver = 'resolver',
  input = 'input'

}


export enum ApiFilePresetType
{
  user = 'user',
  role = 'role',
  address = 'address',
  continent = 'continent',
  province = 'province',
  country = 'country',
  city = 'city',
  district = 'district'
}



export enum ApiFileRootPath
{
  module = 'server/api',
  controller = 'server/api',
  service = 'server/api',
  resolver = 'server/api',
  input = 'server/api'
}


export enum CoreFileType
{
  service = 'service',
  databaseSeedingSource = 'databaseSeedingSource',
  databaseModel = 'databaseModel',
  databaseEntityGenerator = 'databaseEntityGenerator'
}

export enum CoreFileRootPath
{
  service = 'src/core',
  databaseSeedingSource = 'src/core/database/sources',
  databaseModel = 'src/core/database/sources',
  databaseEntityGenerator = ''
}

export enum CoreFilePresetType
{
  appSeedingSource = 'appSeedingSource',
  appDatabaseModel = 'appDatabaseModel',
  appEntityGenerator = 'appEntityGenerator',
  accessControlService = 'accessControlService',
  authService = 'authService',
  serverService = 'serverService'
}


export enum SharedFileType
{
  apiSpec = 'apiSpec',
  appConstants = 'appConstants'
}

export enum SharedFileRootPath
{
  apiSpec = 'src/shared',
  appConstants = 'src/shared'
}


export enum SharedFilePresetType
{
  apiSpec = 'apiSpec',
  appConstants = 'appConstrants'
}


export class FileGeneratorNameMaven extends NameMaven
{
  constructor(public fileType: AppFileType, public fileNamePrefix: string)
  {
    super(fileType, fileNamePrefix);
  }
}

export interface NestifierConfig {
  "templateReadRootDir": string,
  "templateDestRootDir": string,
  "templatePrefix": string,
  "templateAPIVersion": string,

  "apiFileType": {
    "module": string,
    "controller": string,
    "service": string,
    "resolver": string,
    "input": string
  },
  "apiFileRootPaths": {
    "module": string,
    "controller": string,
    "service": string,
    "resolver": string,
    "input": string
  },
  "apiFilePresets": {
    "user": string,
    "role": string,
    "address": string,
    "continent": string,
    "province": string,
    "country": string,
    "city": string,
    "district": string
  }
}
