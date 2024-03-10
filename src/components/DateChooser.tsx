import React, { useState } from "react";
import { Box, HStack, Text, border, Button } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface DateChooserProps {
  id: string;
  name: string;
  selectedDateString: string;
  setSelectedDateString: (date: string) => void;
}

export function DateChooser({ id, name, selectedDateString, setSelectedDateString }: DateChooserProps){
  const [selectedDate, setSelectedDate] = useState(new Date());

  function updateSelectedDate(date: Date | null) {
    if (date) {
      setSelectedDate(date);
      setSelectedDateString(date.toISOString())
    }
  }

  return (
    <HStack justifyContent="flex-start" width={"100%"}>    
      <Text font-weight= "500" fontFamily="'Raleway', sans-serif"> Due Date: </Text>
      <DatePicker selected={selectedDate} onChange={(date) => updateSelectedDate(date)} className="custom-datepicker"/>
    </HStack>
  );
};