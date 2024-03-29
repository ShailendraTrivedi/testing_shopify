import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }) => {
  const { topic, shop, session, admin, payload } =
    await authenticate.webhook(request);

  if (!admin) {
    // The admin context isn't returned if the webhook fired after a shop was uninstalled.
    throw new Response();
  }

  switch (topic) {
    case "APP_UNINSTALLED":
      if (session) {
        await db.session.deleteMany({ where: { shop } });
      }
      console.log('APP_UNINSTALLED webhook fired.');

      break;
    case "CUSTOMERS_DATA_REQUEST":
      console.log("customer data request webhook");

      break;
    case "CUSTOMERS_REDACT":
      console.log("customer data erase webhook");

      break;
    case "SHOP_REDACT":
      console.log("shop data erase webhook");

      break;
    default:
      throw new Response("Unhandled webhook topic", { status: 404 });
  }

  throw new Response();
};
