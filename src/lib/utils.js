/**
 * Utility to check if the given object is empty
 * @param {Object} obj
 */
export function isEmptyObject(obj) {
  let prop;
  for (prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }
  return true;
}
