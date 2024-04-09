/**
 * Text input for forms
 */

import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Textarea,
} from "@chakra-ui/react";
import { Field, useField } from "formik";

export const TextArea = ({ label, ...props }: any) => {
  const [field, meta] = useField(props);
  return (
    <FormControl isInvalid={!!meta.error && meta.touched}>
      <FormLabel>{label}</FormLabel>
      <Field as={Textarea} {...field} {...props} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};
