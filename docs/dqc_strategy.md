# Data Quality Check (DQC) Strategy

## Overview
This document defines the comprehensive Data Quality Check (DQC) strategy for ETL pipelines in the Porygon Demand Forecasting Dataform repository. The strategy establishes standardized data quality validation practices to ensure data reliability, accuracy, and consistency throughout the data transformation process.

## Scope and Objectives

### Primary Objectives
- Ensure data integrity across all transformation layers
- Prevent propagation of erroneous data to downstream consumers
- Establish automated validation gates in the ETL pipeline
- Provide clear data quality metrics and failure points

### Target Layers
Data quality checks will be applied to:
- **Silver Layer**: Intermediate transformations and feature engineering tables
- **Gold Layer**: Reporting and analytics-ready tables

**Note**: Bronze/raw layer tables are excluded as they consist of external tables or BigQuery public datasets that are validated at source.

## DQC Types and Implementation

### 1. Native Dataform BigQuery DQCs
The following checks will be configured directly within SQLX file configurations:

#### 1.1 Uniqueness Assertions
- Validates that key columns contain unique values
- Applied to primary key and business key columns
- Implementation: `uniqueKey` configuration parameter

#### 1.2 Non-Null Assertions
- Ensures critical columns do not contain NULL values
- Applied to mandatory business fields
- Implementation: `nonNull` configuration parameter

### 2. Custom DQCs (SQLX Modules)
The following checks will be implemented as dedicated SQLX assertion modules:

#### 2.1 Completeness Checks
- **Purpose**: Validate row count expectations and data completeness
- **Validation Type**: Count-based thresholds
- **Example Use Cases**:
  - Minimum row count validation
  - Expected row count ranges
  - Comparison against source table counts

#### 2.2 Accuracy Checks
- **Purpose**: Validate business metrics and calculated values
- **Validation Type**: Metric-based assertions
- **Example Use Cases**:
  - Aggregated values within expected ranges
  - Business rule compliance
  - Cross-table metric consistency

### 3. Excluded from Scope
The following quality checks are explicitly excluded from this strategy:

- **Structural Checks**: Schema validation and data type checks (handled by Dataform type system)
- **Anomaly Detection**: Statistical anomaly identification (deferred to drift monitoring)
- **Trend Analysis**: Time-series pattern validation (handled via Python notebooks)

## Implementation Architecture

### Design Principles
1. **Declarative Configuration**: Leverage native Dataform DQC configurations where possible
2. **Code-Based Custom Checks**: Implement complex validations as SQLX assertion modules
3. **Blocking Validation**: All DQCs operate as blocking checks that halt pipeline execution on failure
4. **Modular Design**: DQC modules are reusable and maintainable

### Technical Implementation

#### Step 1: Native DQC Configuration
Add assertions directly in SQLX file configurations:

```javascript
config {
  type: "table",
  schema: "walmart_featurestore",
  uniqueKey: ["store_id", "item_id", "date"],
  assertions: {
    nonNull: ["store_id", "item_id", "date", "sales_amount"]
  }
}
```

#### Step 2: Custom Assertion Modules
Create dedicated SQLX files for custom validations:

```sql
config {
  type: "assertion",
  name: "dqc_master_table_row_count",
  description: "Validate minimum row count for master training table"
}

SELECT
  COUNT(*) AS row_count
FROM
  ${ref("walmart_master_table")}
HAVING
  COUNT(*) < 1000 -- Fail if fewer than 1000 rows
```

#### Step 3: BigQuery DQC Result Validation
Monitor native BigQuery data quality results:

```sql
config {
  type: "assertion",
  name: "dqc_bigquery_validation_status",
  description: "Fail pipeline if any BigQuery DQC did not pass"
}

SELECT
  rule_binding_id,
  rule_name,
  table_id,
  status,
  execution_ts
FROM
  `project_id.dqc_dataset.dqc_results`
WHERE
  status != "PASS"
  AND execution_ts >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 1 DAY)
```

## Failure Handling

### Blocking Behavior
- All DQCs operate as **blocking assertions**
- Pipeline execution halts immediately upon DQC failure
- Failed checks prevent data propagation to dependent downstream tables
- Error messages include specific failure details for troubleshooting

## Rollout Plan

### Phase 1: Silver Layer Implementation (Current)
**Scope**: All intermediate transformation tables except feature store dataset

**Included Tables**:
- `walmart_targets_and_filters.*`
- `walmart_training_tables.*`

**Excluded Tables**:
- `walmart_featurestore.*` (deferred to Phase 2)

**Deliverables**:
1. DQC configurations added to all in-scope SQLX files
2. Custom assertion modules created for completeness and accuracy checks

### Phase 2: Feature Store Implementation (Future)
**Scope**: Feature engineering tables in the feature store dataset

**Target Tables**:
- All tables under `walmart_featurestore/*`

**Timeline**: To be determined based on Phase 1 results and feedback

### Phase 3: Gold Layer Implementation (Future)
**Scope**: Reporting and Looker view tables

**Target Tables**:
- `walmart_looker_views.*`

## Success Criteria

- All silver layer tables have at minimum uniqueness and non-null assertions
- Custom DQC assertions execute successfully during pipeline runs
- Failed DQCs properly block downstream table execution
- Zero erroneous data propagation incidents
- DQC documentation maintained and up-to-date per table
