import { useState } from "react";
import {
  BlockStack,
  Box,
  Button,
  Card,
  Checkbox,
  Divider,
  FormLayout,
  InlineStack,
  Link,
  Page,
  Tag,
  Text,
  TextField,
} from "@shopify/polaris";
import { Form } from "@remix-run/react";

import styles from "./InputForm.css";

let errorMessage = "";
let disableSaveButton = undefined;

const InputForm = ({
  isSubmitting,
  prevMessage,
  prevNumber,
  prevIncludePageUrl,
}) => {
  const [number, setNumber] = useState(prevNumber);
  const [message, setMessage] = useState(prevMessage);
  const [checked, setChecked] = useState(prevIncludePageUrl);

  disableSaveButton =
    (number === prevNumber &&
      message === prevMessage &&
      checked === prevIncludePageUrl) ||
    errorMessage !== "";

  const numberChangeHandler = (value) => {
    if (value === "") errorMessage = "This field is required";
    else if (!/^\d+$/.test(value)) errorMessage = "Only numbers are allowed";
    else errorMessage = "";
    
    setNumber(value);
  };

  const messageChangeHandler = (value) => {
    if (number === "") errorMessage = "This field is required";

    value.includes("{page_url}") ? setChecked(true) : setChecked(false);
    setMessage(value);
  };

  const checkHandler = () => {
    let newMessage;
    if (checked) {
      newMessage = message.replace("{page_url}", "");
    } else {
      newMessage = message.trim() + " {page_url}";
    }
    setMessage(newMessage);
    setChecked((prevState) => !prevState);
  };

  return (
    <Card padding="500">
      <BlockStack>
        <Text as="h1" variant="headingLg" fontWeight="medium">
          Configuration
        </Text>
        <Box paddingBlockStart="300" paddingBlockEnd="600">
          <Divider borderColor="border" />
        </Box>
        <Form method="POST">
          <FormLayout>
            <TextField
              name="number"
              maxLength={20}
              showCharacterCount
              label="WhatsApp Number"
              autoComplete="off"
              helpText="Enter the number with the country code and without any leading zeroes."
              value={number}
              onChange={(value) => numberChangeHandler(value)}
              error={errorMessage}
            />
            <TextField
              name="message"
              label="Custom Message"
              autoComplete="off"
              multiline={3}
              value={message}
              onChange={(value) => messageChangeHandler(value)}
            />
            <Checkbox
              fill={true}
              name="includePageUrl"
              value={checked}
              label="Include page URL in the message"
              onChange={checkHandler}
              checked={checked}
            />
            <InlineStack align="end">
              <Box paddingBlockStart="300">
                <Button
                  size="large"
                  variant="primary"
                  submit
                  disabled={disableSaveButton}
                  loading={isSubmitting}
                >
                  Save Changes
                </Button>
              </Box>
            </InlineStack>
          </FormLayout>
        </Form>
      </BlockStack>
    </Card>
  );
};

export default InputForm;

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};
