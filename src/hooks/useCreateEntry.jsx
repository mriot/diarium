import { useSetRecoilState } from "recoil";
import { dayRecordAtom, readModeAtom } from "../atoms";
import { createNewEntry } from "../backend/recordManipulation";
import dayjs from "dayjs";
import useSelectedDay from "./useSelectedDay";

export default function useCreateEntry() {
  const setDayRecord = useSetRecoilState(dayRecordAtom);
  const setReadMode = useSetRecoilState(readModeAtom);
  const selectedDay = dayjs(useSelectedDay());

  return async () => {
    try {
      const response = await createNewEntry({
        assigned_day: selectedDay.format("YYYY-MM-DD"),
        content: `<h1>${selectedDay.format("dddd, D. MMMM YYYY")}</h1><hr><p></p>`,
        tags: []
      });

      if (response.status === 200) {
        setReadMode(false);
        setDayRecord(response.data);
      }
    } catch (error) {
      // fail silently
    }
  };
};
