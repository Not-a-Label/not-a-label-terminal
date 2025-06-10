module.exports = {
  apps: [{
    name: 'not-a-label',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'development',
      PORT: 3001
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 80,
      OPENAI_API_KEY: process.env.OPENAI_API_KEY,
      RUNPOD_API_KEY: process.env.RUNPOD_API_KEY,
      RUNPOD_ENDPOINT: process.env.RUNPOD_ENDPOINT || 'https://api.runpod.ai/v2/m4ri0is2v69hu1/run',
      OLLAMA_ENDPOINT: process.env.OLLAMA_ENDPOINT || 'https://213-192-2-105-8000.proxy.runpod.net'
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    watch: false,
    max_memory_restart: '512M'
  }]
};
