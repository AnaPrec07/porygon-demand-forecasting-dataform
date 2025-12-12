// include/date_functions.js

/**
 * Generates a column expressions that captures runtime timestamp.
 * @param {string} columnName - The name for the runtime column (default: 'runtime')
 * @returns {string} SQL expression for the runtime column
 */
function getRuntimeTimestamp(columnName = 'processing_timestamp') {
  return `CURRENT_TIMESTAMP() as ${columnName}`;
}

module.exports = {
  getRuntimeTimestamp,
};