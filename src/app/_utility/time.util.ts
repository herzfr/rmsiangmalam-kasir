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

    public getDate(val: number) {
        let dt = new Date(val);
        return moment(dt).format('DD/MM/yyyy HH:mm:ss');
    }

    public getDateMMSS(val: number) {
        let dt = new Date(val);
        return moment(dt).format('DD/MM/yyyy HH:mm');
    }

    public getJustDate(val: number) {
        let dt = new Date(val);
        return moment(dt).format('DD/MM/yyyy');
    }

    public getJustTime(val: number) {
        let dt = new Date(val);
        return moment(dt).format('HH:mm');
    }

    public setTimeInDate(time: string, date: Date): number {
        let t = time.split(':')
        let hour = Number(t[0])
        let minute = Number(t[1])
        return new Date(date).setHours(hour, minute, 0, 0)
    }

    public setTimeInDate2(time: string, date: Date): number {
        let t = time.split(':')
        let hour = Number(t[0])
        let minute = Number(t[1])
        return date.setHours(hour, minute, 0, 0)
    }

    public convertDateTimeLocale(date: Date) {
        return new Date(moment(date).locale('id').utc().toString());
    }

    public convertTimeLocalUTC(date: Date) {
        let min = new Date(moment(date).startOf('day').locale('id').toString());
        let max = new Date(moment(date).endOf('day').locale('id').toString());
        // console.log(min, max);
        return { start: min.getTime(), end: max.getTime() }
    }


}