import React, { useState } from "react";
import { Box, HStack, Text, border, Button, FormLabel, Center } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export function DateRangeChooser({ label, initStartDate, initEndDate, setSelectedStartDateString, setSelectedEndDateString, ...props }: any){
  const [startDate, setStartDate] = useState(initStartDate);
  const [endDate, setEndDate] = useState(initEndDate);
  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);

    if (start) {
      setSelectedStartDateString(start.toISOString());
    }

    if (end) {
      setSelectedEndDateString(end.toISOString());
    }
  };

  return (
    <HStack justifyContent="flex-start" width="100%" alignItems="center">    
      <FormLabel minW={20}>{label}</FormLabel>
      <Box borderWidth='1px' p={3}>
      <DatePicker
      selected={startDate}
      onChange={onChange}
      minDate={initStartDate}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      withPortal
      {...props}
      />
      </Box>
    </HStack>
  );
};