# Get Product Offer List

## Query: `productOfferV2`
**ResultType:** `ProductOfferConnectionV2`

---

# 1. Query Parameters

| Field              | Type   | Description                                                                                                                                                                                                                                                                                                                                                                           | Example     |
|--------------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------|
| shopId (New)       | Int64  | Search by **shop id**                                                                                                                                                                                                                                                                                                                                                                  | `84499012`  |
| itemId (New)       | Int64  | Search by **item id**                                                                                                                                                                                                                                                                                                                                                                  | `17979995178` |
| productCatId (New) | Int32  | Filter specific **Level 1 / 2 / 3 product category** tiers using category id. Use the regional category guides to find correct IDs:<br>• SG: `https://seller.shopee.sg/edu/category-guide`<br>• MY: `https://seller.shopee.com.my/edu/category-guide`<br>• TH: `https://seller.shopee.co.th/edu/category-guide`<br>• TW: `https://seller.shopee.tw/portal/categories`<br>• ID: `https://seller.shopee.co.id/edu/category-guide`<br>• VN: `https://banhang.shopee.vn/edu/category-guide`<br>• PH: `https://seller.shopee.ph/edu/category-guide`<br>• BR: `https://seller.shopee.com.br/edu/category-guide` | `100001`    |
| listType           | Int    | **Type of product offer list** (can only be used together with `matchId`, and cannot be combined with other input fields):<br>• `0` = **ALL** – Recommendation product list (no sort)<br>• `1` = **HIGHEST_COMMISSION** (To Be Removed) – Highest commission product list (no sort)<br>• `2` = **TOP_PERFORMING** – Top performing product list (no sort)<br>• `3` = **LANDING_CATEGORY** – Recommendation category list on landing page (no sort)<br>• `4` = **DETAIL_CATEGORY** – Specific category list in detail page<br>• `5` = **DETAIL_SHOP** – Specific shop list in detail page<br>• `6` = **DETAIL_COLLECTION** (To Be Removed) – Specific collection list in detail page | `1`         |
| matchId            | Int64  | ID used **only with `listType`** (must not be combined with other inputs). Meaning depends on `listType`:<br>• CategoryId for `LANDING_CATEGORY (3)` and `DETAIL_CATEGORY (4)`<br>• ShopId for `DETAIL_SHOP (5)`<br>• CollectionId for `DETAIL_COLLECTION (6)`                                                                                                                          | `10012`     |
| keyword            | String | Search by **product name**                                                                                                                                                                                                                                                                                                                                                             | `shopee`    |
| sortType           | Int    | Sort type:<br>• `1` = **RELEVANCE_DESC** – Only for keyword search, sort by relevance<br>• `2` = **ITEM_SOLD_DESC** – Sort by sold count (high → low)<br>• `3` = **PRICE_DESC** – Sort by price (high → low)<br>• `4` = **PRICE_ASC** – Sort by price (low → high)<br>• `5` = **COMMISSION_DESC** – Sort by commission rate (high → low)                                             | `2`         |
| page               | Int    | Page number                                                                                                                                                                                                                                                                                                                                                                            | `2`         |
| isAMSOffer (New)   | Bool   | Filter by **type of offer**:<br>• `true` = Only offers that have seller (AMS) commission<br>• `false` = All offers regardless of seller (AMS) commission                                                                                                                                                                                                                              | `true`      |
| isKeySeller (New)  | Bool   | Filter for offers from **Shopee's key sellers**:<br>• `true` = Offers from key sellers only<br>• `false` = All offers regardless of key seller status                                                                                                                                                                                                                                 | `true`      |
| limit              | Int    | Number of data per page                                                                                                                                                                                                                                                                                                                                                               | `10`        |

> ⚠️ **Important:**  
> `listType` and `matchId` must be used **together** and **cannot** be combined with other filters like `shopId`, `keyword`, etc.

---

# 2. Response Parameters

| Field    | Type                | Description      |
|----------|---------------------|------------------|
| nodes    | [ProductOfferV2]!   | Data list        |
| pageInfo | PageInfo!           | Page information |

---

# 3. ProductOfferV2 Structure

| Field                    | Type   | Description                                                                                                                                                                                                                                       | Example                         |
|--------------------------|--------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------|
| itemId                   | Int64  | Item ID                                                                                                                                                                                                                                           | `17979995178`                   |
| commissionRate           | String | **Maximum commission rate**, decimal string. E.g. `"0.0123"` for **1.23%**                                                                                                                                                                        | `"0.25"`                        |
| sellerCommissionRate (New) | String | Seller commission rate (Commission Xtra rate)                                                                                                                                                                                                      | `"0.25"`                        |
| shopeeCommissionRate (New) | String | Shopee commission rate                                                                                                                                                                                                                             | `"0.25"`                        |
| commission (New)         | String | Commission amount = `price * commissionRate` (local currency)                                                                                                                                                                                     | `"27000"`                       |
| appExistRate (To Be Removed) | String | Commission rate for non-first-time users on **app** (e.g. `"0.0123"` = 1.23%)                                                                                                                                                                      |                                 |
| appNewRate (To Be Removed)   | String | Commission rate for **new** users on app                                                                                                                                                                                                           |                                 |
| webExistRate (To Be Removed) | String | Commission rate for non-first-time users on **web**                                                                                                                                                                                                |                                 |
| webNewRate (To Be Removed)   | String | Commission rate for **new** users on web                                                                                                                                                                                                           |                                 |
| price (To Be Removed)    | String | Product price (local currency)                                                                                                                                                                                                                    |                                 |
| sales                    | Int32  | Sales count for this product                                                                                                                                                                                                                      | `25`                            |
| priceMax (New)           | String | Maximum product price (local currency)                                                                                                                                                                                                            | `"55.99"`                       |
| priceMin (New)           | String | Minimum product price (local currency)                                                                                                                                                                                                            | `"45.99"`                       |
| productCatIds (New)      | [Int]  | Product category IDs array: `[catLv1, catLv2, catLv3]`. If a level does not exist, the value is `0`.                                                                                                                                              | `[100012, 100068, 100259]`      |
| ratingStar (New)         | String | Product rating as shown on Shopee product page                                                                                                                                                                                                    | `"4.7"`                         |
| priceDiscountRate (New)  | Int    | Discount percentage shown on product page. `10` represents **10%**                                                                                                                                                                               | `10`                            |
| imageUrl                 | String | Image URL                                                                                                                                                                                                                                         |                                 |
| productName              | String | Product name                                                                                                                                                                                                                                      | `IKEA starfish`                 |
| shopId (New)             | Int64  | Shop ID                                                                                                                                                                                                                                           | `84499012`                      |
| shopName                 | String | Shop name                                                                                                                                                                                                                                         | `IKEA`                          |
| shopType (New)           | [Int]  | Shop type flags:<br>• `1` = **OFFICIAL_SHOP** (official / Shopee Mall)<br>• `2` = **PREFERRED_SHOP** (preferred sellers)<br>• `4` = **PREFERRED_PLUS_SHOP** (preferred plus sellers)                                                              | `[]`, `[1,4]`                   |
| productLink              | String | Product link                                                                                                                                                                                                                                      | `https://shopee.co.id/product/14318452/4058376611` |
| offerLink                | String | Offer (affiliate) link                                                                                                                                                                                                                            | `https://shope.ee/xxxxxxxx`     |
| periodStartTime          | Int    | Offer start time (Unix timestamp)                                                                                                                                                                                                                 | `1687539600`                    |
| periodEndTime            | Int    | Offer end time (Unix timestamp)                                                                                                                                                                                                                   | `1688144399`                    |

---

# 4. PageInfo Structure

| Field       | Type | Description              | Example |
|-------------|------|--------------------------|---------|
| page        | Int  | The current page number  | `2`     |
| limit       | Int  | Number of data per page  | `10`    |
| hasNextPage | Bool | If it has next page      | `true`  |

---

# 5. Error Codes

| Error Code | Error Description                                                                                                                    | Remark |
|-----------:|---------------------------------------------------------------------------------------------------------------------------------------|--------|
| 11000      | Business Error                                                                                                                       |        |
| 11001      | Params Error : {reason}                                                                                                              |        |
| 11002      | Bind Account Error : {reason}                                                                                                        |        |
| 10020      | Invalid Signature                                                                                                                    |        |
| 10020      | Your App has been disabled                                                                                                           |        |
| 10020      | Request Expired                                                                                                                      |        |
| 10020      | Invalid Timestamp                                                                                                                    |        |
| 10020      | Invalid Credential                                                                                                                   |        |
| 10020      | Invalid Authorization Header                                                                                                         |        |
| 10020      | Unsupported Auth Type                                                                                                                |        |
| 10030      | Rate limit exceeded                                                                                                                  |        |
| 10031      | access deny                                                                                                                          |        |
| 10032      | invalid affiliate id                                                                                                                 |        |
| 10033      | account is frozen                                                                                                                    |        |
| 10034      | affiliate id in black list                                                                                                           |        |
| 10035      | You currently do not have access to the Shopee Affiliate Open API Platform. Please contact us to request access or learn more.      | contact link: https://help.shopee.co.th/portal/webform/c07a3cf32bfd4cd59f5c819d84583d4e |

---
