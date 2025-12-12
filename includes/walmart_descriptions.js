
// includes/docs.js

// global constants
const ctx_date_month = `Month. Format YYTT-MM-01.`;
const ctx_state_id = `State the store is located at. Can be 'CA', 'TX' or 'WI'.`;
const ctx_store_id = `Store ID.`;
const ctx_cat_id = `Category of the item.`;
const ctx_dept_id = `Department of the Item (can be thought of a sub-category).`;
const ctx_item_id = `The timestamp when the row was processed.`;
const tgt_monthly_sales = `TGT monthly sales for observation.`;
const tgt_monthly_sales_lead_1_months = `TGT monthly sales lead 1 month for observation.`;
const tgt_monthly_sales_lead_2_months = `TGT monthly sales lead 2 months for observation.`;
const tgt_monthly_sales_lead_3_months = `TGT monthly sales lead 3 months for observation.`;
const tgt_monthly_sales_lead_4_months = `TGT monthly sales lead 4 months for observation.`;

// Calendar features
const fea_is_weekend = "Feature indicating the number of weekend days in the month.";
const fea_is_event = "Feature indicating number of special events in the month.";
const fea_is_sporting_event = "Feature indicating number of sporting events in the month.";
const fea_is_cultural_event = "Feature indicating number of cultural events in the month.";
const fea_is_national_event = "Feature indicating number of national events in the month.";
const fea_is_religious_event = "Feature indicating number of religious events in the month.";
const fea_is_snap_ca = "Feature indicating number of days SNAP benefits are accepted in California.";
const fea_is_snap_tx = "Feature indicating number of days SNAP benefits are accepted in Texas.";
const fea_is_snap_wi = "Feature indicating number of days SNAP benefits are accepted in Wisconsin.";
const fea_month_sin = "Sine transformation of the month to capture seasonality.";

module.exports = {
    ctx_date_month,
    ctx_state_id,
    ctx_store_id,
    ctx_cat_id,
    ctx_dept_id,
    ctx_item_id,
    tgt_monthly_sales,
    tgt_monthly_sales_lead_1_months,
    tgt_monthly_sales_lead_2_months,
    tgt_monthly_sales_lead_3_months,
    tgt_monthly_sales_lead_4_months,
};
