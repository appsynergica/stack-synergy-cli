import ora from 'ora';

const spin = ora(`Sensillum Init`);

spin.color = 'cyan';
spin.spinner = 'dots';

export const spinner = spin;
