export enum DENOMINATORDATE {
    DAY = 'day',  // set to 12:00 am today
    YEAR = 'year', // set to January 1st, 12:00 am this year
    MONTH = 'month', // set to the first of this month, 12:00 am
    QUARTER = 'quarter', // set to the beginning of the current quarter, 1st day of months, 12:00 am
    WEEK = 'week',// set to the first day of this week, 12:00 am
    ISOWEEK = 'isoWeek',  // set to the first day of this week according to ISO 8601, 12:00 am
    DATE = 'date',  // set to 12:00 am today
    HOUR = 'hour', // set to now, but with 0 mins, 0 secs, and 0 ms
    MINUTE = 'minute',  // set to now, but with 0 seconds and 0 milliseconds
    SECOND = 'second',
}

export const INTERM: string[] = ['milis', 'utc', 'date']

