module.exports = {
  apps: [{
    name: "backend-empleados",
    script: "./dist/index.js",
    instances: 1,
    exec_mode: "fork",
    error_file: "/var/www/mi-app/backend/logs/err.log",
    out_file: "/var/www/mi-app/backend/logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss Z",
    merge_logs: true,
  }],

  deploy: {
    production: {
      user: "ubuntu",
      host: "3.128.65.14",
      ref: "origin/main",
      repo: "git@github.com:IsaacArboleda29/-Desarrollo-de-una-API.git",
      path: "/var/www/mi-app",
      "post-deploy": "cd backend && npm install && npm run build && mkdir -p logs && pm2 reload ecosystem.config.cjs --env production && pm2 save",
      ssh_options: "IdentityFile=/c/Users/Isaac/OneDrive/Desktop/ClaveServer.pem",
    },
  },
};