const { createApp } = require('./app');
const connectDB = require('./config/db');
const { ensureDefaultAccounts } = require('./seed/ensureDefaultAccounts');
const { ensureDefaultServices } = require('./seed/ensureDefaultServices');

const PORT = process.env.PORT || 5000;
const app = createApp();

(async () => {
  await connectDB();
  await ensureDefaultAccounts();
  await ensureDefaultServices();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
})();
