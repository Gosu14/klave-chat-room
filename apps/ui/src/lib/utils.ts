import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function urlToId(id: string) {
    return id.replace(/-/g, '+').replace(/_/g, '/');
}

export function idToUrl(id: string) {
    return id.replace(/\+/g, '-').replace(/\//g, '_');
}

export function getCurrentDevicePublicKeyHash() {
    return urlToId((window as any).currentDevicePublicKeyHash);
}

export function unixToDateTime(timestamp: number): string {
    const d = new Date(timestamp),
        dd = d.getDate(),
        m = d.getMonth() + 1,
        y = d.getFullYear(),
        h = d.getHours(),
        mi = d.getMinutes();
    return (
        (dd < 10 ? '0' : '') +
        dd +
        '/' +
        (m < 10 ? '0' : '') +
        m +
        '/' +
        y +
        ', ' +
        (h < 10 ? '0' : '') +
        h +
        ':' +
        (mi < 10 ? '0' : '') +
        mi
    );
}
