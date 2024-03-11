import { VStack, Stack, Heading, Button, Box, Text } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { ApiContext, MaybeUser } from "../contexts/ApiContext";

interface LoginFormProps {
  onAuthenticate: (user: MaybeUser) => void;
}

export function LoginForm({ onAuthenticate }: LoginFormProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { user, client } = useContext(ApiContext);

  const displayErrorMessage = () => {
    setErrorMessage("Invalid username or password");
  };

  useEffect(() => {
    if (user) {
      navigate("/projectlist");
    }
  }, [user, navigate]);

  return (
    <Formik
      initialValues={{
        username: "",
        password: "",
      }}
      validationSchema={Yup.object({
        username: Yup.string().required("Username required"),
        password: Yup.string()
          .required("Password required")
          .min(8, "Password must be at least 8 characters"),
      })}
      onSubmit={async (values, actions) => {
        // Query if the user credentials are valid
        const { data, error, response } = await client.POST("/users/login", {
          params: {
            query: values,
          },
        });

        // If the credentials are invalid diplay an error message to the user
        if (error) {
          console.log(error);
          displayErrorMessage();
          // If the response is valid authenticate the user and naviagte to the project list page
        } else if (response.status === 200) {
          onAuthenticate(data);
          actions.resetForm();
          navigate("/projectlist");
        } else {
          console.log(response);
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
            <Heading>Login</Heading>

            <TextField
              id="username"
              name="username"
              label="Username"
              type="username"
              variant="filled"
              placeholder="enter username..."
            />

            <TextField
              id="password"
              name="password"
              label="Password"
              type="password"
              variant="filled"
              placeholder="enter password..."
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
                onClick={() => navigate("/")}
              >
                Back
              </Button>

              <Button type="submit" colorScheme="teal" variant="solid">
                Login
              </Button>
            </Stack>
          </VStack>
        </form>
      )}
    </Formik>
  );
}
