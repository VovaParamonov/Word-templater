const fse = require('fs-extra');
const { exec } = require('child_process');

const addedComponent = process.argv.slice(2)[0];

if (!addedComponent) {
  console.log('Input name of added componet');
  return;
}

function moveComponentsToRightPlace() {
  const srcDir = `@`;
  const destDir = `src/renderer/src`;

// To copy a folder or file, select overwrite accordingly
  try {
    fse.copySync(srcDir, destDir, { overwrite: true });
    fse.rmdirSync(srcDir, { recursive: true });
    console.log('success!');
  } catch (err) {
    console.error(err);
  }
}

exec(`npx shadcn-ui@latest add ${addedComponent}`, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);

  moveComponentsToRightPlace();
});

