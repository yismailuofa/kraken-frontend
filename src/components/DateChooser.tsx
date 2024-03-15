import React, { useState } from "react";
import { Box, HStack, Text, border, Button, FormLabel, Center } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateChooserProps {
  id: string;
  name: string;
  selectedDateString: string;
  setSelectedDateString: (date: string) => void;
  startDate: Date;
}

export function DateChooser({ id, name, selectedDateString, setSelectedDateString, startDate }: DateChooserProps){
  const [selectedDate, setSelectedDate] = useState(startDate);

  function updateSelectedDate(date: Date | null) {
    if (date) {
      setSelectedDate(date);
      setSelectedDateString(date.toISOString())
    }
  }

  return (
    <HStack justifyContent="flex-start" width="100%" alignItems="center">    
      <FormLabel> Due Date: </FormLabel>
      <DatePicker selected={selectedDate} onChange={(date) => updateSelectedDate(date)} className="custom-datepicker"/>
    </HStack>
  );
};