import { json } from "@remix-run/react";
import { apiVersion, authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { session, admin } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  const themes = (
    await admin.rest.resources.Theme.all({
      session: session,
    })
  ).data;

  const mainTheme = themes.find((theme) => theme.role === "main");
  const themeId = mainTheme?.id;

  let assetResponse;
  if (themeId) {
    assetResponse = await admin.rest.resources.Asset.all({
      session: session,
      theme_id: themeId,
      asset: { key: "config/settings_data.json" },
    });
  }

  // const assetResponse = new Promise((resolve) => {
  //   setTimeout(() => {
  //     return resolve();
  //   }, 4000);
  // });

  const loaderResult = {
    values: ["", ""],
    //above metafields will be null when this query runs for the first time after the app installation
    extensionId: process.env.SHOPIFY_CHAT_LINK_ID,
    shop,
    asset: assetResponse,
  };

  const response = await fetch(
    `https://${shop}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/graphql",
        "X-Shopify-Access-Token": accessToken,
      },
      body: `query{
                  currentAppInstallation{
                    number_metafield : metafield(namespace: "whatsapp_configuration", key: "whatsapp_number"){
                      value
                    }
                    message_metafield : metafield(namespace: "whatsapp_configuration", key: "whatsapp_message"){
                      value
                    }
                    include_page_url_metafield : metafield(namespace: "whatsapp_configuration", key: "include_page_url"){
                      value
                    }
                  }
                }`,
    },
  );

  if (!response.ok) {
    return json({
      ...loaderResult,
      success: false,
    });
  }

  const resData = await response.json();

  const {
    data: {
      currentAppInstallation: {
        number_metafield,
        message_metafield,
        include_page_url_metafield,
      },
    },
  } = resData;

  return json({
    ...loaderResult,
    values: [
      number_metafield?.value || "",
      message_metafield?.value || "",
      include_page_url_metafield?.value === "true" ? true : false,
    ],
  });
};
