import {
    VStack,
    Heading,
    Button,
} from "@chakra-ui/react"
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField"

export function RegistrationForm() {
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
            password: Yup.string().required("Password required").min(8, "Password must be at least 8 characters")
        })}
        onSubmit= { (values, actions) => {
            alert(JSON.stringify(values, null, 3));
            actions.resetForm();
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
  
            <Button type="submit" colorScheme="teal" variant="solid">
              Create Account
            </Button>
          </VStack>
        </form>
        )}
      </Formik>
    );
}