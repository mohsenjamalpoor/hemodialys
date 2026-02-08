import _date from "./date";
export const ConvertDateToYYYYMMDDShamsi = time => {
	return _date(time).format("YYYY/MM/DD");
};


