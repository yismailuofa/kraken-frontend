import { VStack, Stack, Heading, Button, Box, } from "@chakra-ui/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { TextField } from "./TextField";
import { useNavigate } from "react-router-dom";
import { TextArea } from "./TextArea";
import { useContext } from "react";
import { ApiContext } from "../contexts/ApiContext";
import { DateChooser } from "./DateChooser";
import { DateRangeChooser } from "./DateRangeChooser";

export function AddSprintForm() {
  const navigate = useNavigate();
  const client = useContext(ApiContext).client;
  const defaultStartDate = new Date();
  let defaultEndDate = new Date();
  defaultEndDate.setDate(defaultEndDate.getDate() + 6);

  return (
    <Box>
      <Formik
        initialValues={{
            sprintName: "",
            description: "",
            startDate: defaultStartDate.toISOString(),
            endDate: defaultEndDate.toISOString(),
        }}
        validationSchema={Yup.object({
          sprintName: Yup.string().required("Sprint name required"),
        })}
        onSubmit={async (values, actions) => {
            console.log(values);
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
              <Heading>Create Sprint</Heading>

              <TextField
                id="sprintName"
                name="sprintName"
                label="Sprint Name"
                type="text"
                variant="filled"
                placeholder="enter sprint name..."
              />

              <TextArea
                id="description"
                name="description"
                label="Description"
                type="text"
                placeholder="enter description..."
              />

              <DateRangeChooser
                id="date"
                name="date"
                label="Start Date - End Date"
                selectedStartDateString={formik.values.startDate}
                selectedEndDateString={formik.values.startDate}
                setSelectedStartDateString={(startDate: any) => formik.setFieldValue("startDate", startDate)}
                setSelectedEndDateString={(endDate: any) => formik.setFieldValue("endDate", endDate)}
                // startDate={new Date()}
              />

              {/* <DateRangeChooser
                id="endDate"
                name="endDate"
                label="End Date"
                onUpdateDate={onUpdateDate}
                // selectedDateString={formik.values.endDate}
                // setSelectedDateString={(date) => formik.setFieldValue("endDate", date)}
                // startDate={new Date()}
              /> */}

              <Stack spacing={4} direction="row" align="center">
                <Button
                  colorScheme="teal"
                  variant="solid"
                  onClick={() => navigate("/sprintslist")}
                >
                  Cancel
                </Button>

                <Button type="submit" colorScheme="teal" variant="solid">
                  Create
                </Button>
              </Stack>
            </VStack>
          </form>
        )}
      </Formik>
    </Box>
  );
}