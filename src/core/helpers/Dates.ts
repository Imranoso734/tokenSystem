import { DateTime } from "luxon"
import { env } from "@/core/helpers"
import { Time } from "./Time";

export const Dates = {

  
  /**
   * Get the current date, taking into account the time offset for Pakistan.
   * The returned date is set to midnight in the Pakistan timezone.
   * @returns The only current date in the Pakistan timezone, set to midnight.
   */
  currentDate(): Date {
    const date = new Date();
    const PKT_OFFSET = 5 * 60 * 60 * 1000; // 5 hours in milliseconds

    // Adjust the date to Pakistan time
    const pakistanDate = new Date(date.getTime() + PKT_OFFSET);

    // Set the time to midnight (start of the day in Pakistan timezone)
    pakistanDate.setUTCHours(0, 0, 0, 0);

    return pakistanDate;
  },

  /**
   * Get the current date as a string, taking into account the time offset for Pakistan.
   * The returned date string is in the format "DD-MM-YYYY".
   * @returns The current date as a string in the Pakistan timezone, in the format "DD-MM-YYYY".
   */
  currentDateString(): string {
    const date = new Date();
    const PKT_OFFSET = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    const pakistanDate = new Date(date.getTime() + PKT_OFFSET);

    // Include date and time formatting options
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
      timeZone: 'UTC' // 'UTC' is set because we are manually adjusting the time
    };

    const formatter = new Intl.DateTimeFormat('en-GB', options)
    const formattedParts = formatter.formatToParts(pakistanDate)


    // Extract each part from the formatted parts array
    const year = formattedParts.find(part => part.type === 'year')?.value || '0'
    const month = formattedParts.find(part => part.type === 'month')?.value || '0'
    const day = formattedParts.find(part => part.type === 'day')?.value || '0'

    return `${day}-${month}-${year}`

  },

  /**
   * Returns a Date object representing the current date and time in the Pakistan timezone.
   * The date is taken from the current date string, and the time is taken from the current time.
   * The resulting Date object is in UTC.
   * @returns A Date object representing the current date and time in Pakistan.
   */
  async getDateTime(): Promise<Date> {
    const dateStr = Dates.currentDateString()
    const time = Time.currentTime()

    const [day, month, year] = dateStr.split('-').map(Number);
    const { hours, minutes } = time;

    // Create a new date object in UTC using the date and time values
    return new Date(Date.UTC(year, month, day, hours, minutes));
  }
}
