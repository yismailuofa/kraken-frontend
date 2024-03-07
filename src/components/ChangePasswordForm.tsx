import { VStack, Stack, Heading, Button, useToast } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";

export function ChangePasswordForm() {
  const navigate = useNavigate();
  const toast = useToast();
  const client = useContext(ApiContext).client;

  return (
    <Formik
      initialValues={{
        password: "",
        passwordCopy: ""
      }}
      validationSchema={Yup.object({
        password: Yup.string()
        .required("Password required")
        .min(8, "Password must be at least 8 characters"),
        passwordCopy: Yup.string()
        .required("Password verification required")
        .min(8, "Password must be at least 8 characters"),
      })}
      onSubmit={async (values, actions) => {
        alert(JSON.stringify(values, null, 2));
        actions.resetForm();

        // Make a request to change user's password
        const { data, error, response } = await client.PATCH("/users/password/reset", {
          params: {
            query: {
              newPassword: values.password
            },
          },
        });

        console.log(response);
        console.log(data);
        
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
              type="text"
              variant="filled"
              placeholder="enter new password..."
            />

            <TextField
              id="passwordCopy"
              name="passwordCopy"
              label="Verify New Password"
              type="text"
              placeholder="enter new password..."
            />

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
