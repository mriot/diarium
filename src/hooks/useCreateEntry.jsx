import { useRecoilValue, useSetRecoilState } from "recoil";
import { dayRecordAtom, readModeAtom, selectedDayAtom } from "../atoms";
import { createNewEntry } from "../backend/recordManipulation";
import dayjs from "dayjs";

export default function useCreateEntry() {
  const setDayRecord = useSetRecoilState(dayRecordAtom);
  const setReadMode = useSetRecoilState(readModeAtom);
  const selectedDay = useRecoilValue(selectedDayAtom);

  return async () => {
    try {
      const response = await createNewEntry({
        assigned_day: dayjs(selectedDay).format("YYYY-MM-DD"),
        content: `<h1>${dayjs(selectedDay).format("dddd, D. MMMM YYYY")}</h1><hr><p></p>`,
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
