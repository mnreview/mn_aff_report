# Get Shop Offer List

## Query: `shopOfferV2`
**ResultType:** `ShopOfferConnectionV2`

---

# 1. Query Parameters

| Field              | Type    | Description                                                                                                                                                                                                                                                                                     | Example            |
|--------------------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------|
| shopId (New)       | Int64   | Search by shop ID                                                                                                                                                                                                                                                                               | `84499012`         |
| keyword            | String  | Search by **shop name**                                                                                                                                                                                                                                                                         | `demo`             |
| shopType (New)     | [Int]   | Filter by specific shop type:<br>• `1` = **OFFICIAL_SHOP** (Mall shop)<br>• `2` = **PREFERRED_SHOP** (Preferred/Star shop)<br>• `4` = **PREFERRED_PLUS_SHOP** (Preferred+/Star+ shop)                                                                                                           | `[]`, `[1,4]`      |
| isKeySeller (New)  | Bool    | Filter for offers from Shopee's key sellers:<br>• `true` = Only offers from key sellers<br>• `false` = All offers regardless of key seller status                                                                                                                                              | `true`             |
| sortType           | Int     | Sort type:<br>• `1` = `SHOP_LIST_SORT_TYPE_LATEST_DESC` (sort by last update time)<br>• `2` = `SHOP_LIST_SORT_TYPE_HIGHEST_COMMISSION_DESC` (sort by commission rate, high → low)<br>• `3` = `SHOP_LIST_SORT_TYPE_POPULAR_SHOP_DESC` (sort by popular shop, high → low)                          | `1`                |
| sellerCommCoveRatio (New) | String | The ratio of products with seller commission. Set as decimal string, e.g. `"0.0123"` if the rate is **≥ 1.23%**.                                                                                                                                                                           | `""`, `"0.123"`    |
| page               | Int     | Page number                                                                                                                                                                                                                                                                                     | `2`                |
| limit              | Int     | Number of data per page                                                                                                                                                                                                                                                                         | `10`               |

---

# 2. Response Parameters

| Field    | Type              | Description        |
|----------|-------------------|--------------------|
| nodes    | [ShopOfferV2]!    | Data list          |
| pageInfo | PageInfo!         | Page information   |

---

# 3. ShopOfferV2 Structure

| Field                  | Type    | Description                                                                                                                                                                                                                                                                                                                                                                                                              | Example                                                   |
|------------------------|---------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------|
| commissionRate         | String  | Commission rate. Set as decimal string, e.g. `"0.0123"` if the rate is **1.23%**.                                                                                                                                                                                                                                                                                                                                        | `"0.25"`                                                  |
| imageUrl               | String  | Image URL                                                                                                                                                                                                                                                                                                                                                                                                                 | `https://cf.shopee.co.id/file/id-11134201-7qul6-lfgbxyzg074186` |
| offerLink              | String  | Offer link (affiliate link / promotion landing)                                                                                                                                                                                                                                                                                                                                                                          | `https://shope.ee/xxxxxxxx`                              |
| originalLink           | String  | Original link (shop URL)                                                                                                                                                                                                                                                                                                                                                                                                  | `https://shopee.co.id/shop/19162748`                      |
| shopId                 | Int64   | Shop ID                                                                                                                                                                                                                                                                                                                                                                                                                   | `84499012`                                                |
| shopName               | String  | Shop name                                                                                                                                                                                                                                                                                                                                                                                                                 | `Ikea`                                                    |
| ratingStar (New)       | String  | Shop rating (as displayed on product detail page)                                                                                                                                                                                                                                                                                                                                                                         | `"3.7"`                                                   |
| shopType (New)         | [Int]   | Shop type flags:<br>• `1` = **OFFICIAL_SHOP** (Shopee Mall / official shop offers)<br>• `2` = **PREFERRED_SHOP** (preferred sellers)<br>• `4` = **PREFERRED_PLUS_SHOP** (preferred plus sellers)<br>May contain combinations like `[1,4]`.                                                                                                                                        | `[]`, `[1,4]`                                             |
| remainingBudget (New)  | Int     | Remaining budget classification for this seller's shop offer:<br>• `0` = **Unlimited** (no budget limit, ends only if seller terminates)<br>• `3` = **Normal** (≥ 50% budget remaining)<br>• `2` = **Low** (< 50% remaining, medium risk of early termination)<br>• `1` = **Very Low** (< 30% remaining, high risk of early termination)                                                     | `1`                                                       |
| periodStartTime        | Int     | Offer start time (Unix timestamp)                                                                                                                                                                                                                                                                                                                                                                                        | `1687712400`                                              |
| periodEndTime          | Int     | Offer end time (Unix timestamp)                                                                                                                                                                                                                                                                                                                                                                                          | `1690822799`                                              |
| sellerCommCoveRatio (New) | String | The ratio of products with seller commission in this shop offer. Same format as `commissionRate`, e.g. `"0.0123"` if rate is ≥ 1.23%.                                                                                                                                                                                                                                                                                   | `""`, `"0.123"`                                           |
| bannerInfo             | BannerInfo | Banner info object for this shop offer                                                                                                                                                                                                                                                                                                                                                                                 |                                                           |

---

# 4. PageInfo Structure

| Field       | Type | Description              | Example |
|-------------|------|--------------------------|---------|
| page        | Int  | The current page number  | `2`     |
| limit       | Int  | Number of data per page  | `10`    |
| hasNextPage | Bool | If there is next page    | `true`  |

---

# 5. BannerInfo Structure

| Field   | Type        | Description        | Example |
|---------|-------------|--------------------|---------|
| count   | Int         | Banner quantity    | `13`    |
| banners | [Banner]!   | Banner list        |         |

---

# 6. Banner Structure

| Field       | Type   | Description          | Example                                                                                  |
|-------------|--------|----------------------|------------------------------------------------------------------------------------------|
| fileName    | String | Image file name      | `"454.jpg"`                                                                              |
| imageUrl    | String | Image URL            | `https://cf.shopee.co.id/file/id-11134297-23010-kq42y2823wlv9d`                          |
| imageSize   | Int    | Image size (bytes)   | `1747107`                                                                                |
| imageWidth  | Int    | Image width (px)     | `5998`                                                                                   |
| imageHeight | Int    | Image height (px)    | `3000`                                                                                   |

---

# 7. Error Codes

| Error Code | Error Description                                                       | Remark |
|-----------:|-------------------------------------------------------------------------|--------|
| 11000      | Business Error                                                          |        |
| 11001      | Params Error : {reason}                                                 |        |
| 11002      | Bind Account Error : {reason}                                           |        |
| 10020      | Invalid Signature                                                       |        |
| 10020      | Your App has been disabled                                              |        |
| 10020      | Request Expired                                                         |        |
| 10020      | Invalid Timestamp                                                       |        |
| 10020      | Invalid Credential                                                      |        |
| 10020      | Invalid Authorization Header                                            |        |
| 10020      | Unsupported Auth Type                                                   |        |
| 10030      | Rate limit exceeded                                                     |        |
| 10031      | access deny                                                             |        |
| 10032      | invalid affiliate id                                                    |        |
| 10033      | account is frozen                                                       |        |
| 10034      | affiliate id in black list                                              |        |
| 10035      | You currently do not have access to the Shopee Affiliate Open API Platform. Please contact us to request access or learn more. | contact link: https://help.shopee.co.th/portal/webform/c07a3cf32bfd4cd59f5c819d84583d4e |

---
