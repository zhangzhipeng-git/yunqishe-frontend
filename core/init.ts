import { http, db } from './context/app-context';

export default async function init() {
    await http.get("/level/f/select/list").then((data: any) => {
        db.set("userLevels", data.data.levels);
    });
}