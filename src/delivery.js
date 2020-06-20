const fetch = require("node-fetch");

const calc = async (params = {}) => {
	// defaults
	params.date =
		params.date ||
		new Date()
			.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })
			.split(",")[0]
			.split(".")
			.reverse()
			.reduce((total, curr) => (total += curr), ""); // YYYYMMDD in Moscow TZ
	params.time = params.time || "2300";

	let url = "https://delivery.pochta.ru/delivery/v1/calculate?json";
	url += "&errorcode=1";
	url += params.object ? `&object=${params.object}` : "";
	url += `&date=${params.date}`;
	url += `&time=${params.time}`;
	url += params.from ? `&from=${params.from}` : "";
	url += params.to ? `&to=${params.to}` : "";
	url += params.county ? `&county=${params.county}` : "";
	url += params.dogovor ? `&dogovor=${params.dogovor}` : "";

	let error, data;

	try {
		const response = await fetch(url);
		const result = await response.json();

		if (response.status !== 200) {
			error = result.errors[0];
			data = null;
		}

		if (response.status === 200) {
			error = null;
			data = result;
		}

		if (response.status === 500) {
			error = {
				code: 500,
				msg: "server error",
			};
			data = null;
		}
	} catch (error) {
		return {
			error: error.message,
			data: null,
		};
	}

	return {
		error: error,
		data: data,
	};
};

const delivery = {
	calc: calc,
};

module.exports = delivery;
