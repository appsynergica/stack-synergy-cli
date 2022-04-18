import fs from 'fs';
import {Maven} from '@appsynergica/common-cli';

export class AppFileMaven<TFileType extends string, TFileRootType extends string> extends Maven
{
    constructor( public terminalRootPaths: Record<string, TFileRootType>, public isVersioned: boolean)
    {
        super();
    }

     getFileTerminalRootPath(fileType: TFileType): TFileRootType
    {
        return this.terminalRootPaths[fileType];
    }



    copyFileWithType(sourceRootDir: string,
                     destRootDir: string,
                     fileType: TFileType,
                     sourceVersion: string,
                     destVersion: string,
                     terminalFolderName: string,
                     fileName: string): string
    {

      const sourcePath = `${this.getDirectoryOfFileWithType(sourceRootDir, fileType, terminalFolderName, sourceVersion)}/${fileName}`;
        const destPath = `${this.getDirectoryOfFileWithType(destRootDir, fileType, terminalFolderName, destVersion)}/${fileName}`;

        // create the destination directory before hand
        this.createDirectoryOfFileWithType(destRootDir, fileType, terminalFolderName, destVersion);

        try{

             fs.copyFileSync(sourcePath, destPath);

             return destPath;

            // logger.verbose(`AppFileSystem readFileWithType--> got contents ${contents}`);

        }catch (e)
        {
            // logger.error(`AppFileSystem readFileWithType--> got ERROR:  ${fxnPrettyJsonApi(e)}`);
            throw e;
        }

    }
     readFileWithType(rootDir: string, fileType: TFileType, version: string, terminalFolderName: string, fileName: string): string
    {
        const pathOfFile = `${this.getDirectoryOfFileWithType(rootDir, fileType, terminalFolderName, version)}/${fileName}`;

        try{

            const  contents = fs.readFileSync(pathOfFile, {encoding: 'utf8'});

            // logger.verbose(`AppFileSystem readFileWithType--> got contents ${contents}`);

            return contents;

        }catch (e)
        {
            // logger.error(`AppFileSystem readFileWithType--> got ERROR:  ${fxnPrettyJsonApi(e)}`);
            throw e;
        }

    }

     getDirectoryOfFileWithType(rootDir: string, fileType: TFileType, terminalFolderName: string, version: string)
    {
        if (this.isVersioned && (version === null || version === undefined))
        {
            throw new Error('Versioned Files Require a version string');
        }

        const versionString = version ? `/${version}` : '';

        return  `${rootDir}/${this.getFileTerminalRootPath(fileType)}${versionString}/${terminalFolderName}`;
    }

     createDirectoryOfFileWithType(rootDir: string, fileType: TFileType, terminalFolderName, version: string)
    {
        const destination = this.getDirectoryOfFileWithType(rootDir, fileType, terminalFolderName, version);
        // const folderStats = fs.statSync(destination);

        fs.mkdirSync(destination, { recursive: true } );
    }

}
