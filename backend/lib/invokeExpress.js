/**
 * Run Express on Vercel Node req/res and wait until the response is fully sent.
 * (serverless-http can hang and never call res.end on Vercel.)
 */
function invokeExpress(app, req, res) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const done = () => {
      if (!settled) {
        settled = true;
        resolve();
      }
    };

    res.on('finish', done);
    res.on('close', done);

    try {
      app(req, res, (err) => {
        if (err && !settled) {
          settled = true;
          reject(err);
        }
      });
    } catch (err) {
      if (!settled) {
        settled = true;
        reject(err);
      }
    }
  });
}

module.exports = { invokeExpress };
