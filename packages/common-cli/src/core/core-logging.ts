import chalk from 'chalk';

/**
 * Simple Logger that has a context for logging output to the console
 */
export class CLILogger
{

    _context: string;

    /**
     * Constructor for instantiating a logger
     * @param context Typically means the file or class where the logger is logging from
     */
    constructor(context: string)
    {
        this.context = context;
    }

    get context(): string
    {
        return this._context;
    }

    set context(value: string)
    {
        this._context = this.createContextText(value);
    }

    createContextText(txt: string | undefined)
    {
        return txt?.length ? `${chalk.yellow('[' + txt + ']')} ` : null;
    }



    public colorData(data: any): string
    {

        if (data instanceof Error)
        {
            return `${chalk.red(data as any)}`;

        }else if (typeof data === 'string')
        {
            return `${chalk.green(data)}`;
        }

        else {
            return `${chalk.magenta(JSON.stringify(data, null, 2))}`;
        }
    }


    log(message: any,  context?: string)
    {
        console.log(`${chalk.green('INFO')} ${chalk.green(this.createContextText(context) ?? this.context ?? '')}${chalk.cyan(message)}`);
    }

    warn(message: any,  context?: string)
    {
        console.log(`${chalk.yellow('WARNING')} ${chalk.green(this.createContextText(context) ?? this.context ?? '')}${chalk.cyan(message)}`);
    }

    debug(message: any,  context?: string)
    {
        console.log(`${chalk.yellow('DEBUG')} ${chalk.green(this.createContextText(context) ?? this.context ?? '')}${chalk.cyan(message)}`);
    }

    error(message: any, context?: string)
    {
        console.log(`${chalk.red('ERROR')} ${chalk.green(this.createContextText(context) ?? this.context ?? '')}${chalk.cyan(message)}`);
    }

}

export const logger = new CLILogger('');