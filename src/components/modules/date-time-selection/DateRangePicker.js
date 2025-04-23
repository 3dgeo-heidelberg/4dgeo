import { de } from 'date-fns/locale'
import {
  Button,
  CalendarCell,
  CalendarGrid,
  DateInput,
  DateRangePicker as AriaDateRangePicker,
  DateRangePickerProps as AriaDateRangePickerProps,
  DateSegment,
  Dialog,
  FieldError,
  Group,
  Heading,
  Label,
  Popover,
  RangeCalendar,
  OverlayArrow,
} from 'react-aria-components';
import {parseAbsoluteToLocal} from '@internationalized/date';
import React, { useEffect, useState } from "react";

import './DateRangePicker.css'

export default function DateRangePicker({ includedDates, dateRange, onDateRangeChange }) {
    const customDayContent = (day) => {
        let extraDot = null;
        if (includedDates.includes(day.getTime())) {
          extraDot = (
            <div
              style={{
                height: "5px",
                width: "5px",
                borderRadius: "100%",
                background: "orange",
                position: "absolute",
                top: 2,
                right: 2,
              }}
            />
          )
        }
        return (
          <div>
            {extraDot}
            {/* <span>{format(day, "d")}</span> */}
          </div>
        )
    }

    let [date, setDate] = useState({
        start: parseAbsoluteToLocal('2021-04-07T18:45:22Z'),
        end: parseAbsoluteToLocal('2021-04-08T20:00:00Z')
      });

    return (
        <AriaDateRangePicker 
            value={{
                start: parseAbsoluteToLocal(new Date(dateRange.startDate).toISOString()),
                end: parseAbsoluteToLocal(new Date(dateRange.endDate).toISOString())
            }}
            onChange={item => onDateRangeChange({
                startDate: item.start.toDate().getTime(),
                endDate: item.end.toDate().getTime()
            })}
            granularity="day"
        >
            <Label>Date Range</Label>
            <Group>
                <DateInput slot="start">
                {(segment) => <DateSegment segment={segment} />}
                </DateInput>
                <span aria-hidden="true">-</span>
                <DateInput slot="end">
                {(segment) => <DateSegment segment={segment} />}
                </DateInput>
                <Button>▼</Button>
            </Group>
            {/* {description && <Text slot="description">{description}</Text>} */}
            <FieldError>Error</FieldError>
            <Popover>
                <OverlayArrow>
                    <svg width={12} height={12} viewBox="0 0 12 12">
                        <path d="M0 0 L6 6 L12 0" />
                    </svg>
                </OverlayArrow>
                <Dialog>
                    <RangeCalendar firstDayOfWeek={'mon'}>
                        <header>
                        <Button slot="previous">◀</Button>
                        <Heading />
                        <Button slot="next">▶</Button>
                        </header>
                        <CalendarGrid>
                        {(date) => <CalendarCell date={date} />}
                        </CalendarGrid>
                    </RangeCalendar>
                </Dialog>
            </Popover>
        </AriaDateRangePicker>
    )
}