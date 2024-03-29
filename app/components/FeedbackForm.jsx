import {
  Box,
  Button,
  Card,
  Divider,
  FormLayout,
  InlineError,
  InlineStack,
  Text,
  TextField,
} from "@shopify/polaris";
import { useState } from "react";

let disableSubmit = true;
let invalidEmail = false;
let errorMessage = "";
const FeedbackForm = () => {
  const [inputs, setInputs] = useState({
    name: "",
    email: "",
    org: "",
    feedback: "",
  });

  const submitHandler = () => {
    document.getElementById("240702723682050").submit();

    shopify.toast.show("Thanks, we have received your feedback.", {
      duration: 2000,
    });

    setInputs({
      name: "",
      email: "",
      org: "",
      feedback: "",
    });
  };

  const inputChangeHandler = (type, val) => {
    const foundEmptyInputs =
      val === "" ||
      (type !== "name" && inputs.name === "") ||
      (type !== "email" && inputs.email === "") ||
      (type !== "org" && inputs.org === "") ||
      (type !== "feedback" && inputs.feedback === "");

    if (type === "email") {
      invalidEmail = true;
      invalidEmail = !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        val,
      );
    }
    disableSubmit = invalidEmail || foundEmptyInputs;

    errorMessage = foundEmptyInputs ? "All fields are required" : "";

    setInputs((prevInputs) => {
      return {
        ...prevInputs,
        [type]: val,
      };
    });
  };

  return (
    <Card padding="500" roundedAbove="xs">
      <Text as="h1" variant="headingLg" fontWeight="medium">
        Share Your Feedback
      </Text>
      <Box paddingBlock="300">
        <Divider borderColor="border" />
      </Box>
      <form
        target="_blank"
        method="post"
        action="https://submit.jotform.com/submit/240702723682050"
        name="form_240702723682050"
        id="240702723682050"
      >
        <FormLayout>
          <Text as="span" tone="subdued" variant="bodySm">
            Help us enhance your experience! Share your feedback, issues or
            suggest any new features.
          </Text>
          {errorMessage && <InlineError message={errorMessage} />}
          <TextField
            name="q4_typeA"
            label="Name"
            type="text"
            value={inputs.name}
            onChange={(val) => inputChangeHandler("name", val)}
            autoComplete="off"
          />
          <TextField
            name="q5_email"
            label="Work Email"
            type="email"
            value={inputs.email}
            onChange={(val) => inputChangeHandler("email", val)}
            autoComplete="off"
            error={invalidEmail ? "Please enter a valid email" : ""}
          />
          <TextField
            name="q6_typeA6"
            label="Organization"
            type="text"
            value={inputs.org}
            onChange={(val) => inputChangeHandler("org", val)}
            autoComplete="off"
          />
          <TextField
            name="q8_typeA8"
            label="Please leave your feedback or any feature requests below"
            type="text"
            multiline={2}
            value={inputs.feedback}
            onChange={(val) => inputChangeHandler("feedback", val)}
            autoComplete="off"
          />
          <InlineStack align="end">
            <Button
              size="large"
              variant="primary"
              onClick={submitHandler}
              disabled={disableSubmit}
            >
              Submit
            </Button>
          </InlineStack>
        </FormLayout>
      </form>
    </Card>
  );
};

export default FeedbackForm;
