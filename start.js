const { exec } = require('child_process');
const os = require('os');

const platform = os.platform();

let command;

switch (platform) {
    case 'darwin':
        command = 'echo Running on macOS && start /B npm run start-mac';
        break;
    case 'win32':
        command = 'echo Running on Windows && start /B npm run start-win';
        break;
    case 'linux':
        command = 'echo Running on Linux && start /B npm run start-linux';
        break;
    default:
        command = 'echo Unknown OS';
}

exec(command, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    if (stderr) {
        console.error(`stderr: ${stderr}`);
    }
});
