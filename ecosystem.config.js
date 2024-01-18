module.exports = {
  apps : [{
    name   : "app1",
    script : "./src/server.js",
    env_production: {
       NODE_ENV: "production"
    },
    env_development: {
       NODE_ENV: "development"
    }
  }]
}