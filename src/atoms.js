import { atom } from "recoil";

export const isLoggedInAtom = atom({
  key: "isLoggedInAtom",
  default: undefined
});

export const readModeAtom = atom({
  key: "readModeAtom",
  default: true
});

export const dayRecordAtom = atom({
  key: "dayRecordAtom",
  default: null
});

export const selectedDayAtom = atom({
  key: "selectedDayAtom",
  default: null
});
