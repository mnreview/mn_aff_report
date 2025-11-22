# Authentication

## Overview
All Shopee Affiliate Open API requests must include authentication information through the **Authorization Header**.

This ensures:
- Identity verification (using AppId)
- Signature validation
- Request timestamp freshness

---

# Authorization Header Structure
```
Authorization: SHA256 Credential={AppId}, Timestamp={Timestamp}, Signature={Signature}
```

### Example
```
Authorization: SHA256 Credential=123456, Timestamp=1599999999, Signature=9bc0bd3ba6c41d98a591976bf95db97a58720a9e6d778845408765c3fafad69d
```

---

# Description of Header Components
| Component  | Description |
|------------|-------------|
| **SHA256** | Algorithm used for generating the signature. Only SHA256 is supported. |
| **Credential** | The **AppId** obtained from the Shopee Affiliate platform. Used to identify the application and generate the signature. |
| **Timestamp** | Must not differ from Shopee server time by more than **±10 minutes**. Used in signature generation. |
| **Signature** | 64-character lowercase hexadecimal SHA256 hash. Generated using:<br>**SHA256(Credential + Timestamp + Payload + Secret)** |

---

# Signature Calculation
Before sending a request, you must obtain your **AppId** and **Secret** from the Shopee Affiliate platform.  
⚠️ **Keep the Secret safe. Do NOT expose or share it.**

### Steps to Calculate Signature

### **1. Prepare Payload**
The payload is the **JSON request body**.

Example payload:
```json
{"query":"{\nbrandOffer{\n    nodes{\n        commissionRate\n        offerName\n    }\n}\n}"}
```

If your query contains string parameters, ensure all quotes are **escaped properly**:
```json
{"query":"{conversionReport(purchaseTimeStart: 1600621200, purchaseTimeEnd: 1601225999, scrollId: \"some characters\"){...}}"}
```

---

### **2. Get the Current Timestamp**
Example:  
`1577836800`

---

### **3. Construct the Signature Factor**
Concatenate:
```
AppId + Timestamp + Payload + Secret
```
This creates a long string used for hashing.

---

### **4. Generate SHA256 Signature**
```
Signature = SHA256(Credential + Timestamp + Payload + Secret)
```
The result is a 64-character **lowercase hexadecimal** string.

Example result:
```
dc88d72feea70c80c52c3399751a7d34966763f51a7f056aa070a5e9df645412
```

---

### **5. Build the Authorization Header**
```
Authorization: SHA256 Credential=123456, Timestamp=1577836800, Signature=dc88d72feea70c80c52c3399751a7d34966763f51a7f056aa070a5e9df645412
```

---

# Full Example

### **Given:**
- AppId = `123456`
- Secret = `demo`
- Current time = `2020-01-01 00:00:00 UTC+0`
- Timestamp = `1577836800`
- Payload:
```json
{"query":"{\nbrandOffer{\n    nodes{\n        commissionRate\n        offerName\n    }\n}\n}"}
```

### Steps:
1. Prepare payload ✔️
2. Obtain timestamp ✔️
3. Construct factor:
```
1234561577836800{"query":"{\nbrandOffer{\n    nodes{\n        commissionRate\n        offerName\n    }\n}\n}"}demo
```
4. SHA256 hash →
```
dc88d72feea70c80c52c3399751a7d34966763f51a7f056aa070a5e9df645412
```
5. Build Authorization header:
```
Authorization: SHA256 Credential=123456, Timestamp=1577836800, Signature=dc88d72feea70c80c52c3399751a7d34966763f51a7f056aa070a5e9df645412
```

---

Document formatted in Markdown (.md).

