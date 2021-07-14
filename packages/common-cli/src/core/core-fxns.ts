import fs from "fs";
import path from "path";
import {logger} from './core-logging';

export async function fxnReadJSONAsync(relativePath: string, isToCreateOnNoFind: boolean): Promise<any>
{
    try {
        const jsonString = await fs.promises.readFile(path.resolve(process.cwd(), relativePath), {encoding: 'utf8'});

        if (jsonString) {
            return JSON.parse(jsonString);
        }

    } catch (e) {
        if (isToCreateOnNoFind) {
            fxnWriteJSON(relativePath, {});
            return {};
        } else {
            logger.error(e);
        }
    }

}


export  function fxnReadJSON(relativePath: string, isToCreateOnNoFind: boolean): any
{
    try {
        const jsonString =  fs.readFileSync(path.resolve(process.cwd(), relativePath), {encoding: 'utf8'});

        if (jsonString) {
            return JSON.parse(jsonString);
        }

    } catch (e) {
        if (isToCreateOnNoFind) {
            fxnWriteJSON(relativePath, {});
            return {};
        } else {
            logger.error(e);
        }
    }

}

export  function fxnWriteJSON(relativePath: string, obj: any)
{
    const jsonString = JSON.stringify(obj, null, 2);

    fs.writeFileSync(relativePath, jsonString, {encoding: 'utf8'});
}

export async function fxnWriteJSONAsync(relativePath: string, obj: any)
{
    const jsonString = JSON.stringify(obj, null, 2);

    await fs.promises.writeFile(relativePath, jsonString, {encoding: 'utf8'});
}
