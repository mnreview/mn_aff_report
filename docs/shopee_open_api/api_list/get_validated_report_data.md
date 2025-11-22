# Get Validated Report Data

## Query: `validatedReport`
**ResultType:** `ValidatedReportConnection!`

---

# 1. Query Parameters

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| validationId (New) | Int64 | Validation ID (found in Billing Information) |  |
| limit | Int | Maximum number of return data |  |
| scrollId | String | **Page cursor** (empty on first request). Valid **30 seconds** only. Required for page 2+. |  |

### ⚠️ Scroll ID Rules
- First query → returns page 1 + `scrollId`
- Max **500 records/page**
- `scrollId` valid **30 seconds only**
- Must query page 2+ **within 30 seconds**
- `scrollId` can be used **once** only
- Query without scrollId must wait **30+ seconds**

---

# 2. Response Parameters

| Field | Type | Description |
|-------|------|-------------|
| nodes | [ValidatedReport]! | Data list |
| pageInfo | PageInfo! | Pagination info |

---

# 3. ValidatedReport Structure

| Field | Type | Description |
|-------|------|-------------|
| purchaseTime | Int | Purchase time |
| clickTime | Int | Click link time |
| conversionId | Int64 | Conversion ID |
| shopeeCommissionCapped | String | Shopee commission after cap (local currency) |
| sellerCommission | String | Seller commission (local currency) |
| totalCommission | String | Total commission (Shopee + Seller) after cap |
| buyerType | String | Buyer type (New/Existing) |
| utmContent | String | Sub-id value from affiliate link |
| device | String | Device type |
| referrer | String | Referrer |
| orders | [ValidatedReportOrder]! | Order list |
| linkedMcnName (New) | String | Linked MCN name |
| mcnContractId (New) | String | MCN contract ID |
| mcnManagementFeeRate (New) | String | MCN fee rate |
| mcnManagementFee (New) | String | MCN fee amount |
| netCommission (New) | String | Net commission after MCN fee |
| campaignType (New) | String | Campaign type |

---

# 4. ValidatedReportOrder Structure

| Field | Type | Description |
|-------|------|-------------|
| orderId | String | Order ID |
| orderStatus | String | UNPAID, PENDING, COMPLETED, CANCELLED |
| shopType | String | Shop type |
| items | [ValidatedReportOrderItem]! | Item list |

---

# 5. ValidatedReportOrderItem Structure

| Field | Type | Description |
|-------|------|-------------|
| shopId | Int64 | Shop ID |
| shopName | String | Shop name |
| completeTime | Int | Affiliate order complete time |
| itemId | Int64 | Item ID |
| itemName | String | Item name |
| itemPrice | String | Item price |
| displayItemStatus (New) | String | Combined order + fraud status |
| actualAmount | String | Purchase value (no vouchers/shipping) |
| qty | Int | Item quantity (adjusted if needed) |
| imageUrl | String | Image URL |
| itemTotalCommission | String | Total commission (Shopee + Seller) |
| itemSellerCommission | String | Seller commission |
| itemSellerCommissionRate | String | Seller commission rate |
| itemShopeeCommissionCapped | String | Shopee commission after cap |
| itemShopeeCommissionRate | String | Shopee commission rate |
| itemNotes | String | Description (pending, cancel, fraud) |
| channelType | String | Buyer source channel |
| attributionType | String | Buyer order type |
| globalCategoryLv1Name | String | Global category level 1 |
| globalCategoryLv2Name | String | Global category level 2 |
| globalCategoryLv3Name | String | Global category level 3 |
| refundAmount | String | Refund amount (digital product only) |
| fraudStatus | String | Fraud status |
| modelId | Int64 | Item variation ID |
| promotionId | String | Promotion ID |
| campaignPartnerName (New) | String | Campaign partner name |
| campaignType (New) | String | Campaign type |

---

# 6. PageInfo Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| limit | Int | Number of items per page | 20 |
| hasNextPage | Bool | Whether next page exists | true |
| scrollId | String | Page cursor (30s expiry) |  |

---

# 7. Error Codes

| Code | Description | Remark |
|-------|-------------|---------|
| 11000 | Business Error |  |
| 11001 | Params Error: {reason} |  |
| 11002 | Bind Account Error: {reason} |  |
| 10020 | Invalid Signature |  |
| 10020 | Your App has been disabled |  |
| 10020 | Request Expired |  |
| 10020 | Invalid Timestamp |  |
| 10020 | Invalid Credential |  |
| 10020 | Invalid Authorization Header |  |
| 10020 | Unsupported Auth Type |  |
| 10030 | Rate limit exceeded |  |
| 10031 | Access denied |  |
| 10032 | Invalid affiliate ID |  |
| 10033 | Account frozen |  |
| 10034 | Affiliate ID in blacklist |  |
| 10035 | No access to Affiliate Open API | https://help.shopee.co.th/portal/webform/c07a3cf32bfd4cd59f5c819d84583d4e |

---

Document generated and formatted in Markdown (.md).

