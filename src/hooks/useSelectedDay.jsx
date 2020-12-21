import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useLocation, useHistory } from "react-router-dom";

dayjs.extend(customParseFormat);

export default function useSelectedDay() {
  const location = useLocation();
  const history = useHistory();
  let selectedDay = dayjs(location.pathname, "/YYYY/MM/DD", true);

  if (!selectedDay.isValid()) {
    selectedDay = dayjs(); // if invalid, use today's date
    history.replace(selectedDay.format("/YYYY/MM/DD"));
  }

  return selectedDay.toDate();
}
