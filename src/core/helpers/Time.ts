export class Time {
  hours: number
  minutes: number

  constructor(hours: number, minutes: number) {
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      throw new Error(`invalid time: ${hours}:${minutes}`)
    }

    this.hours = hours
    this.minutes = minutes
  }
  /**
   * Gets the current time in the Pakistan timezone.
   * @returns The current time in the Pakistan timezone as a Time object.
   */
  public static currentTime(): Time {
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

    // Format the date to get hours and minutes
    const formattedTimeParts = formatter.formatToParts(pakistanDate)

    const hours = parseInt(formattedTimeParts.find(part => part.type === 'hour')?.value || '0', 10)
    const minutes = parseInt(formattedTimeParts.find(part => part.type === 'minute')?.value || '0', 10)

    // return new Time(date.getHours(), date.getMinutes())
    return new Time(hours, minutes)
  }
}
