/**
 * Created by hustcc on 18/1/8.
 * Contract: i@hust.cc
 */

/**
 * 抛错
 * @param condition
 * @param format
 * @param args
 */
export const invariant = (condition, format, ...args) => {
  if (!format) {
    throw new Error('invariant requires an error message argument.');
  }

  if (!condition) {
    let argIndex = 0;
    const errorMsg = format.replace(/%s/g, () => `${args[argIndex++]}`);
    const error = new Error(errorMsg);
    error.name = 'Invariant Violation';
    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};
