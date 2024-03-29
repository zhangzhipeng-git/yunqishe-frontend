import ENV from "../modules/env/env";
import Server from './server-context';
import Client from './client-context';
import Cookie from '../modules/db/Cookie';
import LocalStorage from '../modules/db/LocalStorage';
import SessionStorage from '../modules/db/SessionStorage';
import AppDB from '../modules/db/AppDB';
import AppHttp from '../modules/http/app-http';
import AppSecure  from '../modules/secure/app-secure';
import ComponentsHandler from "../modules/components/components-handler";
import { Context } from "@nuxt/types";
export interface AppContext {
    getDB(): AppDB;
    getHttp(): AppHttp;
    getSecure(): AppSecure;
    getCookie?(): Cookie;
    getLocalStorage?(): LocalStorage;
    getSessionStorage?(): SessionStorage;
    getHandler(): ComponentsHandler;
    addTask?(): void;
    getContext(): Context;
    setContext(context: Context): void;
}
export default class App {
    public static getAppContext(): AppContext {
        if(typeof window !== 'undefined' && (ENV.getReference() === window)) {
            return (<any>Client.getClientContext());
        }
        return (<any>Server.getServerContext());
    }
}
const appContext = App.getAppContext();
export const db = appContext.getDB();
export const http = appContext.getHttp();
export const handler = appContext.getHandler();
export const context = appContext.getContext();


