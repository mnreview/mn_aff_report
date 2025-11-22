import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto-js';

// Initialize the cors middleware
const corsMiddleware = cors({
    methods: ['GET', 'POST', 'OPTIONS'],
});

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result);
            }
            return resolve(result);
        });
    });
}

const SHOPEE_API_URL = 'https://open-api.affiliate.shopee.co.th/graphql';

const generateSignature = (appId, secret, payload, timestamp) => {
    const factor = appId + timestamp + payload + secret;
    return crypto.SHA256(factor).toString(crypto.enc.Hex);
};

export default async function handler(req, res) {
    // Run the middleware
    await runMiddleware(req, res, corsMiddleware);

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

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
}
