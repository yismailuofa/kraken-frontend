import {
    VStack,
    Stack,
    Heading,
    Button,
} from "@chakra-ui/react"
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField"
import { useNavigate } from "react-router-dom";
import { createClientWithToken } from "../client";

export function LoginForm() {
    const navigate = useNavigate();
    const client = createClientWithToken(null);

    return (
      <Formik
        initialValues={{
            username: "",
            password: "",
        }}
        validationSchema={Yup.object({
            username: Yup.string().required("Username required"),
            password: Yup.string().required("Password required").min(8, "Password must be at least 8 characters")
        })}
        onSubmit= { async (values, actions) => {
            alert(JSON.stringify(values, null, 3));
            actions.resetForm();

            // TODO: Verify user credentials
            const {data, error, response} = await client.POST("/users/login", {
              params: {
                query: values
              },
            });
    
            console.log(response.status);
            
            if (response.status == 200) {
              navigate("/projectlist")
            }
            
        }}
      >
        {formik => (
          <form onSubmit={formik.handleSubmit}>
          <VStack
            mx="auto"
            w={{ base: "90%", md: 500}}
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

            <Stack spacing={4} direction='row' align='center'>
                <Button colorScheme="teal" variant="solid" onClick={() => navigate("/")}>
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