import { atom, selector } from "recoil";
import moment from "moment";

export const tokenCheckedAtom = atom({
  key: "tokenCheckedAtom",
  default: false
});

export const isLoggedInAtom = atom({
  key: "isLoggedInAtom",
  default: false
});

export const loggedInSelector = selector({
  key: "loggedInSelector",
  set: ({ set }, status) => {
    set(isLoggedInAtom, status);
    set(tokenCheckedAtom, status);
  }
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
  default: moment(window.location.pathname, "YYYY/MM/DD")
});
