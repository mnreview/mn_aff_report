# Request and Response

## Request
Shopee Affiliate **Open API** requests must use:
- **HTTP Method:** `POST`
- **Content-Type:** `application/json`
- **Endpoint:** `https://open-api.affiliate.shopee.co.th/graphql`

The endpoint is always the same regardless of which query or mutation you call.

### Request Format
```json
{
  "query": "...",
  "operationName": "...",
  "variables": {
    "myVariable": "someValue"
  }
}
```

### Notes
- `operationName` and `variables` are optional.
- When multiple operations exist inside the query, **operationName becomes required**.

---

## Response
If the Open API receives your request correctly, it will respond with:
- **HTTP Status Code:** `200`
- **Response format:** JSON

### Response Structure
```json
{
  "data": { ... },
  "errors": [ ... ]
}
```

### Notes
- If no error occurs, the `errors` field will **not appear**.

---

# Error Structure

| Field | Type | Description |
|--------|--------|-------------|
| message | String | Error overview |
| path | String | Location of the error in the request |
| extensions | object | Additional error details |
| extensions.code | Int | Error code |
| extensions.message | String | Error description |

### Example Error Structure
```json
{
  "errors": [
    {
      "message": "Invalid Signature",
      "path": "conversionReport",
      "extensions": {
        "code": 10020,
        "message": "Signature is incorrect or expired"
      }
    }
  ]
}
```

---

# Error Codes

| Error Code | Meaning | Description |
|------------|----------|-------------|
| **10000** | System error | Internal server error |
| **10010** | Request parsing error | Incorrect query syntax, wrong field type, or API not found |
| **10020** | Identity authentication error | Signature incorrect or expired |
| **10030** | Trigger traffic limiting | Request rate exceeds allowed threshold |
| **11000** | Business processing error | Business logic error |

---

Document formatted in Markdown (.md).