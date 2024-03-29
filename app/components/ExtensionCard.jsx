import { Button, Card, InlineStack, Text } from "@shopify/polaris";
import disabledIcon from "../assets/cross-icon.svg";
import enabledIcon from "../assets/tick-icon.svg";

const ExtensionCard = ({ shop, disabled, extensionId }) => {
  return (
    <Card padding="500">
      <InlineStack blockAlign="center" align="space-between" wrap={false}>
        <InlineStack align="start" blockAlign="center" gap="300" wrap={false}>
          <img
            src={disabled ? disabledIcon : enabledIcon}
            alt="close-icon"
            style={{ width: "40px", maxWidth: "100%" }}
          />
          <Text as="p" variant="headingMd" fontWeight="regular" alignment="center">
            {disabled
              ? "WhatsApp Chat is currently disabled on your store"
              : "WhatsApp Chat is currently enabled on your store"}
          </Text>
        </InlineStack>
        <Button
          size="large"  
          target="_parent"
          url={`https://${shop}/admin/themes/current/editor?context=apps&activateAppId=${extensionId}/widget`}
        >
          {disabled ? "Enable" : "Disable"}
        </Button>
      </InlineStack>
    </Card>
  );
};

export default ExtensionCard;
