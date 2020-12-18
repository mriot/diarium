import { atom } from "recoil";

export const languageAtom = atom({
  key: "languageAtom",
  default: "de"
});

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

export const loadingAtom = atom({
  key: "loadingAtom",
  default: 0
});

export const showHeatmapAtom = atom({
  key: "showHeatmapAtom",
  default: false
});

export const sharedAutoSaverAtom = atom({
  key: "sharedAutoSaverAtom",
  default: null
});
