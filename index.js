const sftp = require("sftp-sync-deploy");

/** @type {import("@types/hexo")} */
hexo.extend.deployer.register("sftp", function(args) {
  const arg={
    ...process.env,
    ...args}
  if (!arg.host || !arg.sshuser) {
    const help = [
      "You should argsure deployment settings in _config.yml first!",
      "",
      "Example:",
      "  deploy:",
      "    type: sftp",
      "    host: <host>",
      "    port: [port] # Default is 21",
      "    user: <user>",
      "    pass: <pass> # leave blank for paswordless connections",
      "    privateKey: [path/to/privateKey] # Optional",
      "    passphrase: [passphrase] # Optional",
      "    agent: [path/to/agent/socket] # Optional, defaults to $SSH_AUTH_SOCK",
      "    remotePath: [remotePath] # Default is `/`",
      "    forceUpload: [boolean] # default is false",
      "    concurrency: [number] # Max number of SFTP tasks processed concurrently. Default to 100.",
      "",
      "For more help, you can check the docs: " +
        "https://hexo.io/docs/one-command-deployment",
    ];

    console.log(help.join("\n"));
    return;
  }

  const config = {
    host: arg.sshhost,
    port: arg.sshport || 22,
    username: arg.sshuser,
    password: arg.sshpass,
    privateKey: arg.privateKey,
    passphrase: arg.passphrase,
    agent: arg.agent || process.env.SSH_AUTH_SOCK,
    localDir: hexo.public_dir,
    remoteDir: arg.remotePath || "/",
  };

  /** @type { import('sftp-sync-deploy').SftpSyncOptions } */
  const options = {
    dryRun: !!arg.dryrun,
    forceUpload: arg.forceUpload,
    excludeMode: "remove",
    concurrency: arg.concurrency || 100,
    // exclude patterns (glob)
    // exclude: [
    //   'node_modules',
    //   'src/**/*.spec.ts'
    // ]
  };
  console.log("Deploying with configuration: ", options);
  return sftp.deploy(config, options);
});
