const soap = require("strong-soap").soap;
const promisify = require("util").promisify;

const createClient = promisify(soap.createClient);

const wsdlUrl = "https://tracking.russianpost.ru/rtm34?wsdl";

const getOperationHistory = async (params = {}) => {
	let client;
	let result = [];

	if (params.language && params.language !== "RUS" && params.language !== "ENG")
		return {
			error: "Язык только RUS или ENG",
			data: null,
		};

	client = await createClient(wsdlUrl);

	try {
		const history = await client.getOperationHistory({
			OperationHistoryRequest: {
				Barcode: params.barCode,
				MessageType: params.messageType || 0,
				Language: params.language || "RUS",
			},
			AuthorizationHeader: {
				login: params.login,
				password: params.password,
			},
		});

		history.result.OperationHistoryData.historyRecord.forEach((element) => {
			result.push(element);
		});
	} catch (error) {
		return {
			error: error.message,
			data: null,
		};
	}

	return {
		error: null,
		data: result,
	};
};

const PostalOrderEventsForMail = async (params = {}) => {
	let result = [];

	if (params.language && params.language !== "RUS" && params.language !== "ENG")
		return {
			error: "Язык только RUS или ENG",
			data: null,
		};

	client = await createClient(wsdlUrl);

	try {
		const history = await client.PostalOrderEventsForMail({
			PostalOrderEventsForMailInput: {
				Barcode: params.barCode,
				Language: params.language || "RUS",
			},
			AuthorizationHeader: {
				login: params.login,
				password: params.password,
			},
		});

		history.result.PostalOrderEventsForMaiOutput.PostalOrderEvent.forEach((element) => {
			result.push(element);
		});
	} catch (error) {
		return {
			error: error.message,
			data: null,
		};
	}

	return {
		error: null,
		data: result,
	};
};

const tracking = {
	getOperationHistory: getOperationHistory,
	PostalOrderEventsForMail: PostalOrderEventsForMail,
};

module.exports = tracking;
