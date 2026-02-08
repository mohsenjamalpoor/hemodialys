import dayjs from "dayjs";
import jalali from "jalali-plugin-dayjs";
 


dayjs.extend(jalali)

export default function _date(date) {
	return dayjs(date).calendar("jalali").locale("fa");
}