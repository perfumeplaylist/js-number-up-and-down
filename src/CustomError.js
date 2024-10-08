export default class CustomError extends Error {
  constructor(name, ...params) {
    super(...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.errorName = name;
    this.date = new Date();
  }
}
