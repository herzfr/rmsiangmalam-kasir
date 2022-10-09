import * as moment from 'moment';
import { DENOMINATORDATE } from '../_constant/general';
export class TimeUtil {
    constructor() { }

    public addMinutes(date: Date, minutes: number) {
        return new Date(date.getTime() + minutes * 60000);
    }

    public convertDateFormat(date: Date, format: string) {
        return moment(date).format(format)
    }

    public getStartOfDay(date: Date, denominate: DENOMINATORDATE, format: string) {
        if (format === 'millis') {
            return moment(date).startOf(denominate).milliseconds()
        } else if (format === 'utc') {
            return moment(date).startOf(denominate).utc()
        } else {
            return moment(date).startOf(denominate)
        }
    }

    public getEndOfDay(date: Date, denominate: DENOMINATORDATE, format: string) {
        if (format === 'millis') {
            return moment(date).endOf(denominate).milliseconds()
        } else if (format === 'utc') {
            return moment(date).endOf(denominate).utc()
        } else {
            return moment(date).endOf(denominate)
        }
    }

    public startTodayTime(date: Date) {
        return date.setUTCHours(0, 0, 0, 0)
    }
    public endTodayTime(date: Date) {
        return date.setUTCHours(23, 59, 59, 999)
    }
}