/**
 * Utility to check if the given object is empty
 * @param {object} obj
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

/**
 * Utility to check if dayRecord is not null and not empty
 * @param {object} dayRecord
 */
export function isDayRecordReady(dayRecord) {
  return !!(dayRecord && !isEmptyObject(dayRecord));
}
