import { DateTime } from "luxon";

export const getEtc = (start: string, end: string) => {
    const tripStart = DateTime.fromISO(start);
    const tripEnd = DateTime.fromISO(end);

    const ETC = tripEnd.diff(tripStart, "minutes");

    return ETC.minutes;
};
