# Overview

## Function List
- **Get Offer List**
- **Get Short Link**
- **Get Conversion Report**

---

# API Calling Process
The **Shopee Affiliate Open API** uses the **GraphQL** specification.

GraphQL is based on HTTP, making it easy to integrate with common HTTP libraries such as cURL, Requests, and more. A variety of open‑source GraphQL clients are available here:

👉 https://graphql.org/code/#graphql-clients

For full GraphQL specifications:
👉 https://graphql.org/

---

# Authentication
All API requests require **Authorization Headers** containing authentication information.

Refer to **#Authentication** in the documentation for the detailed header structure and signing process.

---

# Rate Limit
Shopee Affiliate Open API enforces rate limits:
- **2000 requests per hour**
- If exceeded, the request will be rejected
- You must wait until the next hourly cycle to resume requests

---

# Timestamp & Timezone
- Shopee stores data in **local time (UTC+ for each region)**
- However, timestamps always represent an **absolute moment**, independent of your timezone
- Use the platform timestamp tool to generate a valid timestamp for request signing

---

# Important Notes — MUST READ

## ScrollId
Some API endpoints (e.g., Conversion Report, Validated Report) use **scrollId** for pagination.

Rules:
- You must query **at least twice** to retrieve page 2+ data.
- First request returns:
  - Page 1 data
  - `scrollId`
  - Up to **500 items** per page
- `scrollId` must be used to fetch **page 2 and later**.
- `scrollId` is **valid for only 30 seconds**.
- After receiving a scrollId, you must request subsequent pages **within 30 seconds**.
- If scrollId expires → restart from the first query.
- If making a new query (without scrollId) → must wait **30+ seconds**.

⚠️ **ScrollId is one‑time use only.**

---

# Queryable Time Range (Conversion Report)
- The system only allows querying within the **recent 3 months**.
- This limit is identical to the affiliate system portal.
- Querying beyond the allowed time range will return an error.

---

# Tool to Request & Check API
Shopee provides an internal API explorer tool:

👉 https://open-api.affiliate.shopee.co.th/explorer

Use this tool to:
- Test GraphQL queries/mutations
- Validate request signatures
- Inspect responses

---

