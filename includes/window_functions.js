/**
 * Generates LEAD window function for multiple periods
 * @param {string} columnName - Column to apply LEAD to
 * @param {number} maxLead - Maximum number of LEAD periods (e.g., 28 for 28 days ahead)
 * @param {string} partitionBy - Column(s) to partition by
 * @param {string} orderBy - Column(s) to order by
 * @param {string} alias - Prefix for the generated column aliases (e.g., 'target_')
 * @returns {string} Formatted LEAD window functions
 */
function generateLeadColumns(columnName, maxLead, partitionBy="ctx_item_id, ctx_store_id", orderBy="ctx_date_month", alias = 'lead_') {
  const columns = [];
  for (let i = 1; i <= maxLead; i++) {
    columns.push(
      `    LEAD(${columnName}, ${i}) OVER (PARTITION BY ${partitionBy} ORDER BY ${orderBy}) AS ${columnName}_${alias}${i}_months`
    );
  }
  return columns.join(',\n');
}

/**
 * Alternative: Generate LAG window function
 */
function generateLagColumns(columnName, maxLag, partitionBy="ctx_item_id, ctx_store_id", orderBy="ctx_date_month", alias = 'lag_',) {
  const columns = [];
  for (let i = 1; i <= maxLag; i++) {
    columns.push(
      `    LAG(${columnName}, ${i}) OVER (PARTITION BY ${partitionBy} ORDER BY ${orderBy}) AS ${columnName}_${alias}${i}_months`
    );
  }
  return columns.join(',\n');
}

function generateRollAvgSTDEVNoPartition(columnName, windows = [3, 6, 12]) {
  const columns = [];
  windows.forEach(i => {
    columns.push(
      `    AVG(${columnName}) OVER (ORDER BY ctx_date_month ROWS BETWEEN ${i} PRECEDING AND CURRENT ROW) AS ${columnName}_roll_avg_${i}_months`
    );
    columns.push(
      `    STDDEV(${columnName}) OVER (ORDER BY ctx_date_month ROWS BETWEEN ${i} PRECEDING AND CURRENT ROW) AS ${columnName}_roll_std_${i}_months`
    );
  });
  return columns.join(',\n');
}

function generateRollMedianSTDEVNoPartition(columnName, windows = [3, 6, 12]) {
  const columns = [];
  windows.forEach(i => {
    columns.push(
      `    APPROX_QUANTILES(${columnName}, 100)[OFFSET(50)] OVER (ORDER BY ctx_date_month ROWS BETWEEN ${i} PRECEDING AND CURRENT ROW) AS ${columnName}_roll_median_${i}_months`
    );
    columns.push(
      `    STDDEV(${columnName}) OVER (ORDER BY ctx_date_month ROWS BETWEEN ${i} PRECEDING AND CURRENT ROW) AS ${columnName}_roll_std_${i}_months`
    );
  });
  return columns.join(',\n');
}

function generateRollAvgSTDEVPartition(columnName, partitionBy="ctx_item_id, ctx_store_id", orderBy="ctx_date_month", windows = [3, 6, 12]) {
  const columns = [];
  windows.forEach(i => {
    columns.push(
      `    AVG(${columnName}) OVER (PARTITION BY ${partitionBy} ORDER BY ${orderBy} ROWS BETWEEN ${i} PRECEDING AND CURRENT ROW) AS ${columnName}_roll_avg_${i}_months`
    );
    columns.push(
      `    STDDEV(${columnName}) OVER (PARTITION BY ${partitionBy} ORDER BY ${orderBy} ROWS BETWEEN ${i} PRECEDING AND CURRENT ROW) AS ${columnName}_roll_std_${i}_months`
    );
  });
  return columns.join(',\n');
}

function generateRollMedianSTDEVPartition(columnName, partitionBy="ctx_item_id, ctx_store_id", orderBy="ctx_date_month", windows = [3, 6, 12]) {
  const columns = [];
  windows.forEach(i => {
    columns.push(
      `    APPROX_QUANTILES(${columnName}, 100)[OFFSET(50)] OVER (PARTITION BY ${partitionBy} ORDER BY ${orderBy} ROWS BETWEEN ${i} PRECEDING AND CURRENT ROW) AS ${columnName}_roll_median_${i}_months`
    );
    columns.push(
      `    STDDEV(${columnName}) OVER (PARTITION BY ${partitionBy} ORDER BY ${orderBy} ROWS BETWEEN ${i} PRECEDING AND CURRENT ROW) AS ${columnName}_roll_std_${i}_months`
    );
  });
  return columns.join(',\n');
}

module.exports = {
  generateLeadColumns,
  generateLagColumns,
  generateRollAvgSTDEVNoPartition,
  generateRollAvgSTDEVPartition,
  generateRollMedianSTDEVNoPartition,
  generateRollMedianSTDEVPartition,

};