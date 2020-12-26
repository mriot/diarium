import dayjs from "dayjs";
import { useRecoilValue } from "recoil";
import { dayRecordAtom } from "../atoms";
import { isEmptyObject } from "../lib/utils";
import usePrevious from "./usePrevious";
import useSelectedDay from "./useSelectedDay";

export default function useChangeDetector(config) {
  const dayRecord = useRecoilValue(dayRecordAtom);
  const selectedDay = useSelectedDay();
  const prevDayRecord = usePrevious(dayRecord);
  const prevSelectedDay = usePrevious(selectedDay);

  const dayRecordChanged = dayRecord !== prevDayRecord;
  const selectedDayChanged = !dayjs(selectedDay).isSame(prevSelectedDay);

  switch (true) {
    // BOTH changed
    case selectedDayChanged && dayRecordChanged:
      if (config?.both) {
        console.log("both");
        return true;
      };
      return false;

    // only SELECTED DAY changed
    case selectedDayChanged && !dayRecordChanged:
      if (config?.selectedDay) {
        console.log("selectedDay");
        return true;
      };
      return false;

    // only DAY RECORD changed
    case !selectedDayChanged && dayRecordChanged:
      // console.log("dayRecord");
      if (!prevDayRecord && dayRecord) {
        // loaded (either {} or {...})
        if (config?.dayRecord?.loaded) {
          console.log("loaded");
          return true;
        };
      }
      if (isEmptyObject(prevDayRecord) && !isEmptyObject(dayRecord)) {
        // created
        if (config?.dayRecord?.created) {
          console.log("created");
          return true;
        };
      }
      if (!isEmptyObject(prevDayRecord) && isEmptyObject(dayRecord)) {
        // deleted
        if (config?.dayRecord?.deleted) {
          console.log("deleted");
          return true;
        };
      }
      if (isEmptyObject(prevDayRecord) && isEmptyObject(dayRecord)) {
        // from empty to empty
        // if (config?.dayRecord?.loaded) return true;
        // console.log("dayRecords empty");
      }
      // different
      if (config?.dayRecord === true) {
        console.log("content changed");
        return true;
      };
      return false;
    // BOTH unchanged
    default:
      return false;
  }
}
