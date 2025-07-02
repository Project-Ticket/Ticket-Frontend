"use client";

import React, { useEffect, useState } from "react";
import { Popover } from "@radix-ui/react-popover";
import { PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { Input } from "./ui/input";

const formatTime = (date: Date) => {
  return date.toTimeString().split(" ")[0]; // Extracting HH:mm:ss from date
};

const DateTimePicker = ({
  value,
  onChange,
}: {
  value: Date;
  onChange: (value: Date) => void;
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(value);
  const [time, setTime] = useState<string>(formatTime(value));

  // Update selectedDate and time when the value prop changes
  useEffect(() => {
    setSelectedDate(value);
    setTime(formatTime(value));
  }, [value]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    updateValue(date, time);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value;
    setTime(newTime);
    updateValue(selectedDate, newTime);
  };

  const updateValue = (date: Date, time: string) => {
    const [hours, minutes, seconds] = time.split(":");
    date.setHours(
      parseInt(hours, 10),
      parseInt(minutes, 10),
      parseInt(seconds, 10)
    );
    onChange(date); // Send the updated Date object back to the parent component
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between h-12 font-normal"
            >
              {value ? format(value, "PPP") : "Select date"}
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              onSelect={handleDateChange}
              required
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex-1">
        <Input
          type="time"
          step="1"
          className="h-12"
          value={time}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
};

export default DateTimePicker;
