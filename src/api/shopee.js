import axios from 'axios';

const PROXY_URL = 'http://localhost:3001/api/conversion-report';

export const fetchConversionReport = async (appId, secret, params) => {
  // Construct GraphQL query based on params
  // This is a simplified query for demonstration. 
  // In a real app, you'd build this dynamically based on selected filters.

  const query = `
    {
      conversionReport(
        purchaseTimeStart: ${params.purchaseTimeStart},
        purchaseTimeEnd: ${params.purchaseTimeEnd},
        limit: ${params.limit || 50},
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
    const response = await axios.post(PROXY_URL, {
      appId,
      secret,
      query
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
