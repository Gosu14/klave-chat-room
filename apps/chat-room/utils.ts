import { Context } from "@klave/sdk";
import { RegExp, Match } from "assemblyscript-regex";
import { Axis, AxisMessage } from "./types";

export function convertToU8Array(input: Uint8Array): u8[] {
    let ret: u8[] = [];
    for (let i = 0; i < input.length; ++i)
        ret[i] = input[i];

    return ret;
}

export function convertToUint8Array(input: u8[]): Uint8Array {
    let value = new Uint8Array(input.length);
    for (let i = 0; i < input.length; ++i) {
        value[i] = input[i];
    }

    return value;
}

export function getDate(): i64 {
    //trusted_time is a unix timestamp in nano second, cast it in i64 and convert in ms
    const unixTimeStamp = i64.parse(Context.get("trusted_time")) / 1000000;
    //const date = new Date(unixTimeStamp);
    return unixTimeStamp;
}