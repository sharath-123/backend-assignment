import { parse, isAfter, isBefore, isValid } from 'date-fns';

//parsing various date strings and return a Date or null
export function parseDateLoose(str){
    if(!str) return null;

    const iso = new Date(str);
    if(isValid(iso)) return iso;


    const tryFormats = ["MMMM d, yyyy", "MMM d, yyyy", "d MMM yyyy", "MM/dd/yyyy"];

    for(const fmt of tryFormats){
        try{
            const parsed = parse(str, fmt, new Date());
            if(isValid(parsed)) return parsed;
        } catch (e) {
            //ignore
        }
    }

    const parsed = new Date(Date.parse(str));
    return isValid(parsed) ? parsed : null;
}

export function inRange(dt, start, end){
    if(!dt) return false;
    if(start && isBefore(dt, new Date(start))) return false;
    if(end && isAfter(dt, new Date(end))) return false;
    return true;
}