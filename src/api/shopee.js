import axios from 'axios';
import { retryAxiosRequest } from '../utils/retry';

const PROXY_URL = '/api/conversion-report';

export const fetchConversionReport = async (appId, secret, params) => {
  // Construct GraphQL query based on params
  // This is a simplified query for demonstration. 
  // In a real app, you'd build this dynamically based on selected filters.

  const query = `
    {
      conversionReport(
        purchaseTimeStart: ${params.purchaseTimeStart},
        purchaseTimeEnd: ${params.purchaseTimeEnd},
        limit: ${params.limit || 500},
        scrollId: "${params.scrollId || ''}"
      ) {
        nodes {
          purchaseTime
          clickTime
          conversionId
          conversionStatus
          shopeeCommissionCapped
          sellerCommission
          totalCommission
          buyerType
          utmContent
          device
          referrer
          orders {
            orderId
            orderStatus
            shopType
            items {
              shopId
              shopName
              completeTime
              itemId
              itemName
              itemPrice
              actualAmount
              qty
              imageUrl
              itemTotalCommission
              itemSellerCommission
              itemShopeeCommissionCapped
              itemNotes
              channelType
              attributionType
              globalCategoryLv1Name
              globalCategoryLv2Name
              globalCategoryLv3Name
              refundAmount
              fraudStatus
            }
          }
        }
        pageInfo {
          hasNextPage
          scrollId
        }
      }
    }
  `;

  try {
    const response = await retryAxiosRequest(
      () => axios.post(PROXY_URL, {
        appId,
        secret,
        query
      }),
      {
        onRetry: (attempt, delay) => {
          console.log(`🔄 Retrying conversion report request (attempt ${attempt})...`);
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchClickReport = async (appId, secret, params) => {
  // GraphQL query for Click Report
  // Parameters: clickTimeStart, clickTimeEnd, subId, limit, scrollId
  const query = `
    {
      clickReport(
        clickTimeStart: ${params.clickTimeStart},
        clickTimeEnd: ${params.clickTimeEnd},
        ${params.subId ? `subId: "${params.subId}",` : ''}
        limit: ${params.limit || 500},
        scrollId: "${params.scrollId || ''}"
      ) {
        nodes {
          clickTime
          subId
          utmSource
          utmMedium
          utmCampaign
          utmContent
          utmTerm
          device
          referrer
          clickCount
          shortLink
          originUrl
        }
        pageInfo {
          hasNextPage
          scrollId
        }
      }
    }
  `;

  try {
    const response = await retryAxiosRequest(
      () => axios.post(PROXY_URL, {
        appId,
        secret,
        query
      }),
      {
        onRetry: (attempt, delay) => {
          console.log(`🔄 Retrying click report request (attempt ${attempt})...`);
        }
      }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching click report:", error);
    throw error;
  }
};

export const generateShortLink = async (appId, secret, originUrl, subIds = []) => {
  const query = `
    mutation {
      generateShortLink(input: {
        originUrl: ${JSON.stringify(originUrl)},
        subIds: ${JSON.stringify(subIds)}
      }) {
        shortLink
      }
    }
  `;

  try {
    const response = await retryAxiosRequest(
      () => axios.post(PROXY_URL, {
        appId,
        secret,
        query
      }),
      {
        onRetry: (attempt, delay) => {
          console.log(`🔄 Retrying short link generation (attempt ${attempt})...`);
        }
      }
    );

    if (response.data.errors) {
      throw new Error(response.data.errors[0].message);
    }

    return response.data.data.generateShortLink.shortLink;
  } catch (error) {
    console.error("Error generating short link:", error);
    throw error;
  }
};
