const { exec } = require('child_process');

//OPEN PULL REQUEST PAGE
exec("git config --get remote.origin.url", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        process.exit(1);
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        process.exit(1);
    }

    var url = stdout.substring(
        stdout.lastIndexOf("@") + 1,
        stdout.lastIndexOf(".git")
    );
    url = `https://${url}/pull-requests/new`
    console.log(url);

    var start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    require('child_process').exec(start + ' ' + url);

    process.exit(0)
});
