# Get Conversion Report Data

## Query: `conversionReport`
**ResultType:** `ConversionReportConnection!`

---

# 1. Query Parameters

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| purchaseTimeStart | Int | Start of place order time range (Unix timestamp) |  |
| purchaseTimeEnd | Int | End of place order time range (Unix timestamp) |  |
| completeTimeStart | Int | Start of order complete time range (Unix timestamp) |  |
| completeTimeEnd | Int | End of order complete time range (Unix timestamp) |  |
| shopName | String | Shop name |  |
| shopId | Int64 | Shop ID |  |
| shopType | [String] | Shop Type:<br>• ALL<br>• SHOPEE_MALL_CB<br>• SHOPEE_MALL_NON_CB<br>• C2C_CB<br>• C2C_NON_CB<br>• PREFERRED_CB<br>• PREFERRED_NON_CB | `[SHOPEE_MALL_CB]` |
| checkoutId (Deprecated) | Int64 | Checkout ID |  |
| conversionId | Int64 | Conversion ID (formerly Checkout ID) |  |
| conversionStatus (Deprecated) | String | Conversion status:<br>• ALL (default)<br>• PENDING<br>• COMPLETED<br>• CANCELLED |  |
| orderId | String | Order ID |  |
| productName | String | Product name |  |
| productId | Int64 | Product ID |  |
| categoryLv1Id | Int64 | Level 1 category ID |  |
| categoryLv2Id | Int64 | Level 2 category ID |  |
| categoryLv3Id | Int64 | Level 3 category ID |  |
| categoryType | String | Product type:<br>• ALL (default)<br>• DP<br>• MP |  |
| orderStatus | String | Order status:<br>• ALL (default)<br>• UNPAID<br>• PENDING<br>• COMPLETED<br>• CANCELLED |  |
| buyerType | String | Buyer type:<br>• ALL (default)<br>• NEW<br>• EXISTING |  |
| attributionType | String | Attribution type:<br>• Ordered in Same Shop<br>• Ordered in Different Shop |  |
| device | String | Device type:<br>• ALL (default)<br>• APP<br>• WEB |  |
| limit | Int | Maximum number of return data |  |
| productType | String | Product type:<br>• ALL (default)<br>• DP<br>• MP |  |
| fraudStatus | String | Fraud Status:<br>• ALL<br>• UNVERIFIED<br>• VERIFIED<br>• FRAUD |  |
| scrollId | String | **Page cursor** (empty on first request). Valid **30 seconds only**. Required for page 2+. |  |
| campaignPartnerName (New) | String | Affiliate campaign partner |  |
| campaignType (New) | String | Campaign type:<br>• ALL (default)<br>• Seller Open Campaign<br>• Seller Target Campaign<br>• MCN Campaign<br>• Non-Seller Campaign |  |

### ⚠️ Scroll ID Rules
- First query returns page 1 + `scrollId`
- Max 500 records per page
- `scrollId` lasts **30 seconds** only
- Must use `scrollId` to fetch page 2+ **within 30 seconds**
- If expired → restart from first query
- Query without scrollId must wait **30+ seconds**

---

# 2. Response Parameters

| Field | Type | Description |
|-------|------|-------------|
| nodes | [ConversionReport]! | Data list |
| pageInfo | PageInfo! | Pagination info |

---

# 3. ConversionReport Structure

| Field | Type | Description |
|-------|------|-------------|
| purchaseTime | Int | Purchase time |
| clickTime | Int | Click link time |
| checkoutId (Deprecated) | Int64 | Conversion ID |
| conversionId | Int64 | Conversion ID |
| conversionStatus (Deprecated) | String | Conversion status |
| grossCommission (Deprecated) | String | Shopee gross commission (before cap) |
| cappedCommission (Deprecated) | String | Shopee commission (after cap) |
| totalBrandCommission (Deprecated) | String | Total seller commission |
| estimatedTotalCommission (Deprecated) | String | Estimated gross commission |
| shopeeCommissionCapped | String | Shopee commission after cap |
| sellerCommission | String | Seller commission |
| totalCommission | String | Total commission (before MCN fee) |
| buyerType | String | Buyer status (New/Existing) |
| utmContent | String | Sub-id |
| device | String | Device type |
| referrer | String | Referrer |
| orders | [ConversionReportOrder]! | Order list |
| linkedMcnName (New) | String | Linked MCN name |
| mcnContractId (New) | Int64 | MCN contract ID |
| mcnManagementFeeRate (New) | String | MCN management fee rate |
| mcnManagementFee (New) | String | MCN management fee amount |
| netCommission (New) | String | Net commission after MCN fee |
| campaignType (New) | String | Campaign type |

---

# 4. ConversionReportOrder Structure

| Field | Type | Description |
|-------|------|-------------|
| orderId | String | Order ID |
| orderStatus | String | UNPAID, PENDING, COMPLETED, CANCELLED |
| shopType | String | Shop type |
| items | [ConversionReportOrderItem]! | Item list in order |

---

# 5. ConversionReportOrderItem Structure

| Field | Type | Description |
|-------|------|-------------|
| shopId | Int64 | Shop ID |
| shopName | String | Shop name |
| completeTime | Int | Order completed time |
| itemId | Int64 | Item ID |
| itemName | String | Item name |
| itemPrice | String | Item price |
| displayItemStatus (New) | String | Combined order + fraud status |
| actualAmount | String | Purchase value (no vouchers/shipping) |
| qty | Int | Quantity |
| imageUrl | String | Image URL |
| itemCommission (Deprecated) | String | Shopee commission (item) |
| grossBrandCommission (Deprecated) | String | Brand commission |
| itemTotalCommission | String | Total commission (before MCN fee) |
| itemSellerCommission | String | Seller commission |
| itemSellerCommissionRate | String | Seller commission rate |
| itemShopeeCommissionCapped | String | Shopee commission (after cap) |
| itemShopeeCommissionRate | String | Shopee commission rate |
| itemNotes | String | Pending/cancel/fraud notes |
| channelType | String | Buyer order source |
| attributionType | String | Buyer order type |
| globalCategoryLv1Name | String | Global category level 1 |
| globalCategoryLv2Name | String | Global category level 2 |
| globalCategoryLv3Name | String | Global category level 3 |
| refundAmount | String | Refund amount (Digital products) |
| fraudStatus | String | Fraud status |
| modelId | Int64 | Item variation ID |
| promotionId | String | Promotion ID |
| campaignPartnerName (New) | String | Campaign partner name |
| campaignType (New) | String | Campaign type |

---

# 6. PageInfo Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| limit | Int | Number of data per page | 20 |
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
| 10035 | No access to Shopee Affiliate Open API (contact support) | https://help.shopee.co.th/portal/webform/c07a3cf32bfd4cd59f5c819d84583d4e |

---

Document generated and formatted in Markdown (.md).

