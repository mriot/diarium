import { useRecoilState, useSetRecoilState } from "recoil";
import { dayRecordAtom, readModeAtom, selectedDayAtom } from "../atoms";
import { deleteEntryById } from "../backend/recordManipulation";
import { toast } from "react-toastify";
import dayjs from "dayjs";

export default function useDeleteEntry() {
  const [dayRecord, setDayRecord] = useRecoilState(dayRecordAtom);
  const setReadMode = useSetRecoilState(readModeAtom);
  const [selectedDay, setSelectedDay] = useRecoilState(selectedDayAtom);

  return async () => {
    if (prompt(
      "Bist du dir sicher, dass du den Eintrag vom " +
      `${dayjs(selectedDay).format("dd, DD.MM.YYYY")} löschen möchtest? 😐\n` +
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
    // hack to trigger calendar month overview refresh
    setSelectedDay(dayjs(selectedDay).add(1, "ms").toDate());
    return true;
  };
};