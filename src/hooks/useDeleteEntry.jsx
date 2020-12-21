import { useRecoilState, useSetRecoilState } from "recoil";
import { dayRecordAtom, readModeAtom } from "../atoms";
import { deleteEntryById } from "../backend/recordManipulation";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { useHistory, useLocation } from "react-router-dom";

export default function useDeleteEntry() {
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const setReadMode = useSetRecoilState(readModeAtom);
  const history = useHistory();
  const location = useLocation();

  return async () => {
    const selectedDay = dayjs(location.pathname, "YYYY/MM/DD");

    if (prompt(
      "Bist du dir sicher, dass du den Eintrag vom " +
      `${selectedDay.format("dd, DD.MM.YYYY")} löschen möchtest? 😐\n` +
      "Gib zum Bestätigen bitte 'ok' ein"
    ) !== "ok") return;

    const result = await deleteEntryById(dayRecord.entry_id);

    if (result.error) {
      toast.error(`Der Eintrag konnte nicht gelöscht werden. 🙈 Der Server antwortete mit: ${result.error}`);
      console.error(result.error);
      return false;
    }

    toast.info("Der Eintrag wurde gelöscht! 💀");
    console.log("The deleted entry:", result);
    setReadMode(true);
    setDayRecord({});
    // trigger calendar update
    history.replace(selectedDay.format("/YYYY/MM/DD"), { updateCalendar: true });
    return true;
  };
};
