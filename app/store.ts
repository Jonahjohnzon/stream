import {proxy} from "valtio"

export const store = proxy({
    server:{
        label:"Dragon",
        server:"1"
    }
})