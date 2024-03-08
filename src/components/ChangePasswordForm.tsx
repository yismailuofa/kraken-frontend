import { VStack, Stack, Heading, Button, useToast, Box, Text } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { ApiContext } from "../contexts/ApiContext";

export function ChangePasswordForm() {
  const [errorMessage, setErrorMessage] = useState("");
  
  const navigate = useNavigate();
  const toast = useToast();
  const client = useContext(ApiContext).client;

  const displayErrorMessage = () => {
    setErrorMessage("Password and password verification do not match");
  };

  return (
    <Formik
      initialValues={{
        password: "",
        passwordConfirmation: ""
      }}
      validationSchema={Yup.object({
        password: Yup.string()
        .required("Password required")
        .min(8, "Password must be at least 8 characters"),
        passwordConfirmation: Yup.string()
        .required("Password verification required")
        .min(8, "Password must be at least 8 characters"),
      })}
      onSubmit={async (values, actions) => {
        // Only submit the request if the new password matches the confirmed password
        if (values.password === values.passwordConfirmation) {
          // Make a request to change user's password
          const { data, error, response } = await client.PATCH("/users/password/reset", {
            params: {
              query: {
                newPassword: values.password
              },
            },
          });

          // If there is an error changing the password notify the user with a toast message
          if (error) {
            console.log(error);
            toast({
              title: "Password Change Failed",
              description: "There was an error changing your password.",
              status: "error",
              duration: 8000,
              isClosable: true,
              position: "top",
            });
          // If the response is valid navigate to the project list page and notify the user with a success toast message
          } else if (response.status === 200) {
            actions.resetForm();
            navigate("/projectlist");
            toast({
              title: "Password Changed Successfully",
              description: "Your password has been successfully changed.",
              status: "success",
              duration: 8000,
              isClosable: true,
              position: "top",
            });
          } else {
            console.log(response);
          }
        } else {
          displayErrorMessage();
        }
        
      }}
    >
      {(formik) => (
        <form onSubmit={formik.handleSubmit}>
          <VStack
            mx="auto"
            w={{ base: "90%", md: 500 }}
            h="100vh"
            justifyContent="center"
          >
            <Heading>Change Password</Heading>

            <TextField
              id="password"
              name="password"
              label="New Password"
              type="password"
              variant="filled"
              placeholder="enter new password..."
            />

            <TextField
              id="passwordConfirmation"
              name="passwordConfirmation"
              label="Confirm New Password"
              type="password"
              placeholder="enter new password..."
            />

            {errorMessage && (
              <Box>
                <Text color="tomato"> {errorMessage} </Text>
              </Box>
            )}

            <Stack spacing={4} direction="row" align="center">
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => navigate("/projectlist")}
              >
                Cancel
              </Button>

              <Button type="submit" colorScheme="teal" variant="solid">
                Change Password
              </Button>
            </Stack>
          </VStack>
        </form>
      )}
    </Formik>
  );
}
