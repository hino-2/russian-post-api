const fetch = require("node-fetch");

const currentDateInMoscowTZ = () => {
	return new Date()
		.toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })
		.split(",")[0]
		.split(".")
		.reverse()
		.reduce((total, curr) => (total += curr), "");
};

const getCategories = async () => {
	try {
		const response = await fetch("https://tariff.pochta.ru/tariff/v1/dictionary?jsontext&category=all");
		const data = await response.json();

		return { error: null, data: data };
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

const getCategoryInfo = async (id) => {
	try {
		const response = await fetch(`https://tariff.pochta.ru/tariff/v1/dictionary?jsontext&category=${id}`);
		const data = await response.json();

		return { error: null, data: data };
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

const getObjectInfo = async (id, date = currentDateInMoscowTZ()) => {
	try {
		const response = await fetch(
			`https://tariff.pochta.ru/tariff/v1/dictionary?jsontext&object=${id}&date=${date}`
		);
		const data = await response.json();

		return { error: null, data: data };
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

const getServicesList = async () => {
	try {
		const response = await fetch(`https://tariff.pochta.ru/tariff/v1/dictionary?jsontext&service`);
		const data = await response.json();

		return { error: null, data: data };
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

const getCountriesList = async (date = currentDateInMoscowTZ()) => {
	try {
		const response = await fetch(`https://tariff.pochta.ru/tariff/v1/dictionary?jsontext&country&date=${date}`);
		const data = await response.json();

		return { error: null, data: data };
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

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
	params.closed = params.closed || 1;

	let url = "https://tariff.pochta.ru/tariff/v1/calculate?json";
	url += "&errorcode=1";
	url += params.object ? `&object=${params.object}` : "";
	url += params.date ? `&date=${params.date}` : "";
	url += params.closed ? `&closed=${params.closed}` : "";
	url += params.from ? `&from=${params.from}` : "";
	url += params.to ? `&to=${params.to}` : "";
	url += params.country ? `&country=${params.country}` : "";
	url += params.region ? `&region=${params.region}` : "";
	url += params.weight ? `&weight=${params.weight}` : "";
	url += params.sumoc ? `&sumoc=${params.sumoc}` : "";
	url += params.sumnp ? `&sumnp=${params.sumnp}` : "";
	url += params.sumgs ? `&sumgs=${params.sumgs}` : "";
	url += params.sumin ? `&sumin=${params.sumin}` : "";
	url += params.sum ? `&sum=${params.sum}` : "";
	url += params.sum_month ? `&sum_month=${params.sum_month}` : "";
	url += params.month ? `&month=${params.month}` : "";
	url += params.size ? `&size=${params.size}` : "";
	url += params.count ? `&count=${params.count}` : "";
	url += params.pack ? `&pack=${params.pack}` : "";
	url += params.countinpack ? `&countinpack=${params.countinpack}` : "";
	url += params.dogovor ? `&dogovor=${params.dogovor}` : "";
	url += params.isavia ? `&isavia=${params.isavia}` : "";
	url += params.service ? `&service=${params.service.join(",")}` : "";

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

const tariff = {
	getCategories: getCategories,
	getCategoryInfo: getCategoryInfo,
	getObjectInfo: getObjectInfo,
	getServicesList: getServicesList,
	getCountriesList: getCountriesList,
	calc: calc,
};

module.exports = tariff;
