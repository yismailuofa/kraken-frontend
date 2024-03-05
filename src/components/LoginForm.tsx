import {
    VStack,
    Stack,
    Heading,
    Button,
} from "@chakra-ui/react"
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField"
import { useNavigate, redirect } from "react-router-dom";
import { createClientWithToken } from "../client";
import AuthProvider from "react-auth-kit";
import useSignIn from 'react-auth-kit/hooks/useSignIn';
// import auth from "./auth";

export function LoginForm() {
    const navigate = useNavigate();
    const client = createClientWithToken(null);
    const signIn = useSignIn();

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

            // TODO: Verify user credentials
            const {data, error, response} = await client.POST("/users/login", {
              params: {
                query: values
              },
            });

            console.log(data);
            console.log(data?.token!)
            
            if (response.status == 200) {
                if(signIn({
                  auth: {
                      token: data?.token!,
                      type: 'Bearer'
                  },
                  userState: { email: data?.email, username: data?.username }
                })){
                    actions.resetForm();
                    navigate("/projectlist");
                } else {
                    //Throw error
                    console.log("error")
                    console.log(response.status)
                }
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