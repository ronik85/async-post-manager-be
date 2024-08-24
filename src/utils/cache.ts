import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

export const getCache = (key: string) => cache.get(key);
export const setCache = (key: string, value: any) => cache.set(key, value);
