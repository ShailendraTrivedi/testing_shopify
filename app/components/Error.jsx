import {
  BlockStack,
  Box,
  Button,
  Card,
  Page,
  Spinner,
  Text,
} from "@shopify/polaris";
import img from "../assets/bug-fixing-illustration.svg";
import { Link, useNavigation } from "@remix-run/react";

export default function Error() {
  const navigation = useNavigation();

  return (
    <Page narrowWidth>
      <Box paddingBlock="2400" paddingInline="500">
        <BlockStack gap="500" inlineAlign="center">
          <img
            src={img}
            alt="error image"
            style={{ margin: "auto", width: "50%" }}
          />
          <Text as="h1" variant="headingXl" fontWeight="medium" alignment="center">
            Something went wrong
          </Text>
          <Text as="h2" variant="headingMd" fontWeight="medium" tone="subdued" alignment="center">
            Sorry, there were some technical issues while processing your request.
          </Text>
          {/* <Button
          size="large"
          target="_parent"
          url="https://admin.shopify.com/store/quickstart-08be2fc6/apps/whatsapp_chat-3"
        >
          Go Back
        </Button> */}
          <Text as="span" variant="headingMd" fontWeight="medium">
            {/* <Link
              target="_parent"
              monochrome
              url="https://admin.shopify.com/store/quickstart-08be2fc6/apps/whatsapp_chat-3"
            >
              Go Back
            </Link> */}

            {navigation.state === "loading" ? (
              <Spinner size="small" />
            ) : (
              <Link to="../app" style={{ color: "black" }}>
                Go Back
              </Link>
            )}
          </Text>
        </BlockStack>
      </Box>
    </Page>
  );
}
