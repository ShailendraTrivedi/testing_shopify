import { apiVersion } from "../shopify.server";


export const showToast = (actionSuccess, loaderSuccess) => {
  let success;
  if (actionSuccess !== undefined) success = actionSuccess;
  if (loaderSuccess !== undefined) success = loaderSuccess;
  if (success !== undefined) {
    if (success) shopify.toast.show("Changes Saved", { duration: 2000 });
    else
      shopify.toast.show("Something went wrong. Please try again.", {
        duration: 2000,
        isError: true,
      });
  }
};

export const fetchMerchantData = async (session) => {
  const { shop, accessToken } = session;
  const response = await fetch(
    `https://${shop}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/graphql",
        "X-Shopify-Access-Token": accessToken,
      },
      body: `{
            shop {
              email
              billingAddress {
                company
                phone
                formattedArea
              }
              myshopifyDomain
              email
              contactEmail
            }
          }`,
    },
  );

  const resData = await response.json();
  return resData;
};
