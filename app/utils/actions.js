import { json } from "@remix-run/react";
import { apiVersion, authenticate } from "../shopify.server";

export const action = async ({ request }) => {
  let resData, id;
  const formData = await request.formData();

  const { session } = await authenticate.admin(request);
  const { shop, accessToken } = session;

  const number = formData.get("number");
  const message = formData.get("message");
  const includePageUrl = formData.get("includePageUrl") || false;

  let query = `query {
      currentAppInstallation {
        id
      }
    }`;

  let response = await fetch(
    `https://${shop}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/graphql",
        "X-Shopify-Access-Token": accessToken,
      },
      body: query,
    },
  );

  if (!response.ok) {
    console.log("couldn't get app id");
    // throw new Response("Something went wrong", {
    //   status: 500
    // });
    return json({
      success: false,
    });
  }
  resData = await response.json();
  id = resData.data.currentAppInstallation.id;

  //this mutation creates the metafield or updates the previous metafield with the same namespace and key
  query = `mutation CreateAppDataMetafield($metafieldsSetInput: [MetafieldsSetInput!]!){
      metafieldsSet(metafields: $metafieldsSetInput){ 
          metafields{
            id
            value
          }
          userErrors{
            field
            message
          }
      }
    }`;

  const variables = {
    metafieldsSetInput: [
      {
        namespace: "whatsapp_configuration",
        key: "whatsapp_number",
        type: "single_line_text_field",
        value: number,
        ownerId: id,
      },
      {
        namespace: "whatsapp_configuration",
        key: "whatsapp_message",
        type: "single_line_text_field",
        value: message,
        ownerId: id,
      },
      {
        namespace: "whatsapp_configuration",
        key: "include_page_url",
        type: "boolean",
        value: includePageUrl.toString(),
        ownerId: id,
      },
    ],
  };

  response = await fetch(
    `https://${shop}/admin/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    },
  );

  if (!response.ok) {
    console.log("couldn't create metafield");
    return json({ success: false });
  } else return json({ success: true });
};
