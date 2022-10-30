module.exports = {
  apps : [
    {
      name: "diploma-backend",
      script: "./bin/index.js",
      env: {
        "NODE_ENV": "production",
      }
    }
  ]
};
