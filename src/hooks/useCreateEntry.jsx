import { useSetRecoilState } from "recoil";
import { dayRecordAtom, readModeAtom } from "../atoms";
import { createNewEntry } from "../backend/recordManipulation";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";

export default function useCreateEntry() {
  const setDayRecord = useSetRecoilState(dayRecordAtom);
  const setReadMode = useSetRecoilState(readModeAtom);
  const location = useLocation();

  return async () => {
    const selectedDay = dayjs(location.pathname, "YYYY/MM/DD");

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
