module.exports = async function (req, res, next) {
  try {
    const { appsecret } = req.headers;
    if (!appsecret) {
      throw new Error(
        JSON.stringify({ status: 404, error: "appSecret not found" })
      );
    }
    if (appsecret !== process.env.HMS_APP_SECRET) {
      throw new Error(
        JSON.stringify({ status: 401, error: "Wrong app secret" })
      );
    }
    next();
  } catch (err) {
    const parsedError = JSON.parse(err.message);
    console.log({ err });
    res
      .status(parsedError.status)
      .json({ cause: "webhook appSecret", message: parsedError.error });
  }
};
