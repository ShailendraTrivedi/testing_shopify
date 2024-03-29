import {
  isRouteErrorResponse,
  useActionData,
  useLoaderData,
  useNavigation,
  useRouteError,
} from "@remix-run/react";

import { useEffect } from "react";

import InputForm from "../components/InputForm";
import { links as inputFormLinks } from "../components/InputForm";
import {
  BlockStack,
  Box,
  InlineStack,
  Layout,
  Page,
  Text,
} from "@shopify/polaris";
import ExtensionCard from "../components/ExtensionCard";
import { showToast } from "../utils/utils";
import FeedbackForm from "../components/FeedbackForm";

export const links = () => {
  return [...inputFormLinks()];
};

export default function Index() {
  let isSubmitting = false;
  const {
    values,
    asset,
    shop,
    extensionId,
    success: loaderSuccess,
  } = useLoaderData();
  const navigation = useNavigation();
  const { success: actionSuccess } = useActionData() || {};

  const [prevNumber, prevMessage, prevIncludePageUrl] = values;

  useEffect(() => {
    //need useEffect, otherwise gonna get "shopify is not defined" error on loader errors
    if (navigation.state !== "submitting") {
      showToast(actionSuccess, loaderSuccess);
    }
  });

  if (navigation.state === "submitting") isSubmitting = true;

  let disabled = true;
  if (asset) {
    const blocks = JSON.parse(asset.data[0].value).current.blocks;

    if (blocks) {
      const block = Object.values(blocks).find((block) =>
        block.type.includes(extensionId),
      );

      if (block) disabled = block.disabled;
      else disabled = true;
    } else disabled = true;
  }

  return (
    <Page title="WhatsApp Integration Lite">
      <Box paddingInline={{ xs: "300", sm: "0" }}>
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              <ExtensionCard
                shop={shop}
                disabled={disabled}
                extensionId={extensionId}
              />
              {!disabled && (
                <InputForm
                  isSubmitting={isSubmitting}
                  prevMessage={prevMessage}
                  prevNumber={prevNumber}
                  prevIncludePageUrl={prevIncludePageUrl}
                  disabled={disabled}
                />
              )}
            </BlockStack>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <FeedbackForm />
          </Layout.Section>
        </Layout>
      </Box>
    </Page>
  );
}

export { loader } from "../utils/loaders";
export { action } from "../utils/actions";
