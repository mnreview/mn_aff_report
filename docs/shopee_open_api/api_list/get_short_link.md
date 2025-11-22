# Get Short Link

## Mutation: `generateShortLink`
**ResultType:** `ShortLinkResult!`

---

# 1. Parameters

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| originUrl | String! | Original URL | https://shopee.co.th/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319 |
| subIds | [String] | Sub IDs passed in UTM content (supports up to 5 sub IDs) | ["s1", "s2", "s3", "s4", "s5"] |

---

# 2. Result

| Field | Type | Description |
|-------|------|-------------|
| shortLink | String! | Generated short link |

---

# 3. Example (cURL)

```bash
curl -X POST 'https://open-api.affiliate.shopee.co.th/graphql' \
-H 'Authorization:SHA256 Credential=123456, Signature=x9bc0bd3ba6c41d98a591976bf95db97a58720a9e6d778845408765c3fafad69d, Timestamp=1577836800' \
-H 'Content-Type: application/json' \
--data-raw '{
  "query": "mutation{\n    generateShortLink(input:{originUrl:\"https://shopee.co.th/Apple-Iphone-11-128GB-Local-Set-i.52377417.6309028319\",subIds:[\"s1\",\"s2\",\"s3\",\"s4\",\"s5\"]}){\n        shortLink\n    }\n}"
}'
```

---

Document formatted as Markdown (.md).

