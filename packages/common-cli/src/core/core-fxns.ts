import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import Flatted from 'flatted';
import {logger} from './core-logging';





export async function fxnReadJSONAsync(relativePath: string, isToCreateOnNoFind: boolean, placeholderRootObject?: object | any[]): Promise<any>
{
    try {
        const jsonString = await fs.promises.readFile(path.resolve(process.cwd(), relativePath), {encoding: 'utf8'});

        if (jsonString) {
            return JSON.parse(jsonString);
        }

    } catch (e) {
        if (isToCreateOnNoFind) {
            fxnWriteJSON(relativePath, placeholderRootObject);
            return {};
        } else {
            logger.error(e);
        }
    }

}


export  function fxnReadJSON(pathOfFile: string, isToCreateOnNoFind: boolean): any
{

    try {
        const jsonString =  fs.readFileSync(pathOfFile, {encoding: 'utf8'});

        if (jsonString) {
            return JSON.parse(jsonString);
        }

    } catch (e) {
        if (isToCreateOnNoFind) {
            fxnWriteJSON(pathOfFile, {});
            return {};
        } else {
            logger.error(e);
        }
    }

}

export  function fxnWriteJSON(pathOfFile: string, obj: any)
{

    const jsonString = JSON.stringify(obj, null, 2);

    const dir = path.dirname(pathOfFile);

    if(!fs.existsSync(dir))
    {
        fs.mkdirSync(dir, {recursive: true});
    }

    fs.writeFileSync(pathOfFile, jsonString, {encoding: 'utf8'});
}

export async function fxnWriteJSONAsync(pathOfFile: string, obj: any)
{
    const jsonString = JSON.stringify(obj, null, 2);

    const dir = path.dirname(pathOfFile);

    if(!fs.existsSync(dir))
    {
        await fs.promises.mkdir(dir, {recursive: true});
    }

    await fs.promises.writeFile(pathOfFile, jsonString, {encoding: 'utf8'});
}


export function fxnPrettyJsonApi(data: any, isNested = false): string
{
    if (data)

    {
        const jsonString  = isNested ? Flatted.stringify(data, null, 2) :  JSON.stringify(data, null, 2);

        if (data instanceof Error)
        {
            return `${chalk.red(jsonString)}`;

        }else if (typeof data === 'string')
        {
            return `${chalk.green(jsonString)}`;
        }

        else {
            return `${chalk.magenta(jsonString)}`;
        }

        return `${chalk.magenta(jsonString)}`;

    }

    return data;
}

export async function fxnTraverseDirectory(pathOfDirectory: string, perFile: (pathOfFile: string) => void): Promise<string[]>
{
    const terminalDirsAndFiles = await fs.promises.readdir(pathOfDirectory, {withFileTypes: true});

    let filePaths: string[] = [];

    for (const singTerminalDirOrFile of terminalDirsAndFiles)
    {
        const singFullPath = path.resolve(pathOfDirectory, singTerminalDirOrFile.name);

        if (singTerminalDirOrFile.isDirectory())
        {
            const locPaths = await fxnTraverseDirectory(singFullPath, perFile);

            locPaths?.forEach(x => filePaths.push(x));

        }
        else // this is a file
        {
            filePaths.push(singFullPath);

            await perFile(singFullPath); // run the closure for the file
        }
    }

    return filePaths;
}
