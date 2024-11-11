import {v4 as uuid} from 'uuid'

export function Generateid ( ):string{
    const id = uuid().slice(0,6);
    return id;
}