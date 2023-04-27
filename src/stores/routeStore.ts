import { atom, WritableAtom } from 'nanostores';

export const latestIndex: WritableAtom<number> = atom(0);
