import { ExecSyncOptions, execSync } from 'child_process';

const execSyncOptions: ExecSyncOptions = { stdio: 'inherit' };
const languages = [
    'chinese',
    'czech',
    'dutch',
    'finnish',
    'french',
    'german',
    'greek',
    'hungarian',
    'italian',
    'japanese',
    'korean',
    'norwegian',
    'polish',
    'romanian',
    'russian',
    'spanish',
];

console.info(`Generate bundle for language 'english'.`);
execSync('ng build', execSyncOptions);

for (const language of languages) {
    console.info(`\nGenerate bundle for language '${language}'.`);
    execSync(
        `ng build --configuration production,${language} --no-delete-output-path`,
        execSyncOptions,
    );
}
