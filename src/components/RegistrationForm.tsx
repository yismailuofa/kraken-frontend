import { VStack, Stack, Heading, Button } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { createClientWithToken } from "../client";

export function RegistrationForm() {
  const navigate = useNavigate();
  // const client = createClientWithToken(null);
  const client = createClientWithToken(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NWU2NTg3YmU4YWE3ZTljY2UxNmYzMGIifQ.D9AVBUITtBnlUupSgbVTjPMNNZzjc0NGpgavn6vt8W8"
  ); // This token is me, but normally youd pass the token from the user

  client.GET("/users/me").then((res) => {
    console.log(res);
  });

  return (
    <Formik
      initialValues={{
        username: "",
        email: "",
        password: "",
      }}
      validationSchema={Yup.object({
        username: Yup.string().required("Username required"),
        email: Yup.string().required("Email required"),
        password: Yup.string()
          .required("Password required")
          .min(8, "Password must be at least 8 characters"),
      })}
      onSubmit={(values, actions) => {
        alert(JSON.stringify(values, null, 3));
        actions.resetForm();

        const res = client.POST("/users/register", {
          body: values,
        });

        console.log(res);
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
            <Heading>Sign Up</Heading>

            <TextField
              id="username"
              name="username"
              label="Username"
              type="username"
              variant="filled"
              placeholder="enter username..."
            />

            <TextField
              id="email"
              name="email"
              label="Email Address"
              type="email"
              variant="filled"
              placeholder="enter email..."
            />

            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="filled"
              placeholder="enter password..."
            />

            <Stack spacing={4} direction="row" align="center">
              <Button
                colorScheme="teal"
                variant="solid"
                onClick={() => navigate("/")}
              >
                Back
              </Button>

              <Button type="submit" colorScheme="teal" variant="solid">
                Create Account
              </Button>
            </Stack>
          </VStack>
        </form>
      )}
    </Formik>
  );
}
