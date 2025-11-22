import express from 'express';
import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto-js';
import 'dotenv/config';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.co.th/graphql';

// Helper to generate signature
const generateSignature = (appId, secret, payload, timestamp) => {
    const factor = appId + timestamp + payload + secret;
    return crypto.SHA256(factor).toString(crypto.enc.Hex);
};

app.post('/api/conversion-report', async (req, res) => {
    const { appId, secret, query } = req.body;

    if (!appId || !secret || !query) {
        return res.status(400).json({ error: 'Missing appId, secret, or query' });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const payload = JSON.stringify({ query });
    const signature = generateSignature(appId, secret, payload, timestamp);

    try {
        const response = await axios.post(
            SHOPEE_API_URL,
            { query },
            {
                headers: {
                    'Authorization': `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        res.json(response.data);
    } catch (error) {
        console.error('API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message, details: error.response ? error.response.data : null });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
