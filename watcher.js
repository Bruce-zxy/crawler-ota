const { spawn, exec } = require('child_process');
// free = spawn(process.platform === 'win32' ? 'npm.cmd' : 'npm', ['install', 'npx', '-g']);
// // 捕获标准输出并将其打印到控制台 
// free.stdout.on('data', function(data) {
//     console.log('standard output:\n' + data);
// });

// // 捕获标准错误输出并将其打印到控制台 
// free.stderr.on('data', function(data) {
//     console.log('standard error output:\n' + data);
// });

// // 注册子进程关闭事件 
// free.on('exit', function(code, signal) {
//     console.log('child process eixt ,exit:' + code);
// });


exec('npm install -g npx', (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});