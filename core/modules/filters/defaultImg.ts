import consts from "~/core/consts";

export default function defaultImg(v: string) {
    return v || consts.ERROR_IMG;
}