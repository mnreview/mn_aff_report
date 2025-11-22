# Get Shopee Offer List

## Query: `shopeeOfferV2`
**ResultType:** `ShopeeOfferConnectionV2!`

---

# 1. Query Parameters

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| keyword | String | Search by offer name | clothes |
| sortType | Int | Sort type:<br>**1** = LATEST_DESC (sort by latest update)<br>**2** = HIGHEST_COMMISSION_DESC (sort by highest commission rate) | 1 |
| page | Int | Page number | 2 |
| limit | Int | Number of data per page | 10 |

---

# 2. Response Parameters

| Field | Type | Description |
|-------|------|-------------|
| nodes | [ShopeeOfferV2]! | Offer list |
| pageInfo | PageInfo! | Pagination info |

---

# 3. ShopeeOfferV2 Structure

| Field | Type | Description |
|-------|------|-------------|
| commissionRate | String | Commission rate (e.g., "0.0123" for 1.23%) |
| imageUrl | String | Image URL |
| offerLink | String | Offer link |
| originalLink | String | Original link |
| offerName | String | Offer name |
| offerType | Int | Offer type:<br>• **1** = CAMPAIGN_TYPE_COLLECTION<br>• **2** = CAMPAIGN_TYPE_CATEGORY |
| categoryId | Int64 | Returned when offerType = CATEGORY |
| collectionId | Int64 | Returned when offerType = COLLECTION |
| periodStartTime | Int | Offer start time |
| periodEndTime | Int | Offer end time |

---

# 4. PageInfo Structure

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| page | Int | Current page number | 2 |
| limit | Int | Number of data per page | 10 |
| hasNextPage | Bool | Whether next page exists | true |

---

Document formatted in Markdown (.md).

