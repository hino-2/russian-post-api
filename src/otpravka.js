const fetch = require("node-fetch");
const fs = require("fs");

//#region orders
/**
 * Creates new orders
 *
 * @see https://otpravka.pochta.ru/specification#/orders-creating_order
 */
const createOrders = async (orders = []) => {
	try {
		const response = await fetch("https://otpravka-api.pochta.ru/1.0/user/backlog", {
			method: "PUT",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(orders),
		});

		const result = await response.json();

		return {
			error: result.errors || null,
			data: result["result-ids"] || null,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets info about existing order by ID which you've specified when created it
 *
 * @see https://otpravka.pochta.ru/specification#/orders-search_order
 */
const getOrderByShopId = async (query = "") => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/backlog/search?query=${query}`, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets info about existing order by Russian Post's inner ID. You get those in return when you invoke createOrders method.
 *
 * @see https://otpravka.pochta.ru/specification#/orders-search_order_byid
 */
const getOrderByPostId = async (id = "") => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/backlog/${id}`, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Edits specified order
 *
 * @see https://otpravka.pochta.ru/specification#/orders-editing_order
 */
const editOrder = async (id, newParams = {}) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/backlog/${id}`, {
			method: "PUT",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(newParams),
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Deletes specified order
 *
 * @see https://otpravka.pochta.ru/specification#/orders-delete_new_order
 */
const deleteOrders = async (ids = []) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/backlog`, {
			method: "DELETE",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(ids),
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Returns specified order from batch to "new"
 *
 * @see https://otpravka.pochta.ru/specification#/orders-delete_new_order
 */
const returnOrdersFromBatchToNew = async (ids = []) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/user/backlog`, {
			method: "POST",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(ids),
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};
//#endregion orders

//#region batches
/**
 * Creates a batch from specified orders
 *
 * @see https://otpravka.pochta.ru/specification#/batches-create_batch_from_N_orders
 */
const createBatch = async (ids = [], { sendingDate, timezoneOffset, useOnlineBalance } = {}) => {
	let url = "https://otpravka-api.pochta.ru/1.0/user/shipment?";
	url += sendingDate ? `sending-date=${sendingDate}` : "";
	url += timezoneOffset ? `&timezone-offset=${timezoneOffset}` : "";
	url += useOnlineBalance ? `&use-online-balance=${useOnlineBalance}` : "";

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(ids),
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Changes batch sending date
 *
 * @see https://otpravka.pochta.ru/specification#/batches-sending_date
 */
const changeBatchSendingDate = async ({ batchName, year, month, dayOfMonth } = {}) => {
	try {
		const response = await fetch(
			`https://otpravka-api.pochta.ru/1.0/batch/${batchName}/sending/${year}/${month}/${dayOfMonth}`,
			{
				method: "POST",
				headers: {
					Authorization: `AccessToken ${otpravka.token}`,
					"X-User-Authorization": `Basic ${otpravka.key}`,
					"Content-Type": "application/json;charset=UTF-8",
				},
			}
		);

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Adds existing orders to existing batch
 *
 * @see https://otpravka.pochta.ru/specification#/batches-move_orders_to_batch
 */
const addExistingOrdersToExistingBatch = async (batchName, ids = []) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/batch/${batchName}/shipment`, {
			method: "POST",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(ids),
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets batch's info by it's name
 *
 * @see https://otpravka.pochta.ru/specification#/batches-find_batch
 */
const getBatchInfoByName = async (batchName) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/batch/${batchName}`, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets order's info by track ID
 *
 * @see https://otpravka.pochta.ru/specification#/batches-find_orders_with_barcode
 */
const getOrderInfoByTrackId = async (trackId) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/shipment/search?query=${trackId}`, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Creates new orders and puts them into specified batch
 *
 * @see https://otpravka.pochta.ru/specification#/batches-add_orders_to_batch
 */
const addNewOrdersToExistingBatch = async (batchName, orders = []) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/batch/${batchName}/shipment`, {
			method: "PUT",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(orders),
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Removes orders from batch
 *
 * @see https://otpravka.pochta.ru/specification#/batches-delete_order_from_batch
 */
const removeOrdersFromBatch = async (ids = []) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/shipment`, {
			method: "DELETE",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
			body: JSON.stringify(ids),
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets info about orders in a batch
 *
 * @see https://otpravka.pochta.ru/specification#/batches-get_info_about_orders_in_batch
 */
const getOrdersInfoByBatchName = async (batchName, { size, sortType, page } = {}) => {
	let url = `https://otpravka-api.pochta.ru/1.0/batch/${batchName}/shipment?`;
	url += size ? `size=${size}` : "";
	url += sortType ? `&sort=${sortType}` : "";
	url += page ? `&page=${page}` : "";

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets all the batches
 *
 * @see https://otpravka.pochta.ru/specification#/batches-search_all_batches
 */
const getBatches = async ({ size, sortType, page } = {}) => {
	let url = `https://otpravka-api.pochta.ru/1.0/batch?`;
	url += size ? `size=${size}` : "";
	url += sortType ? `&sort=${sortType}` : "";
	url += page ? `&page=${page}` : "";

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets info about order which is in a batch
 *
 * @see https://otpravka.pochta.ru/specification#/batches-find_order_by_id
 */
const getOrderInfoById = async (id) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/shipment/${id}`, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};
//#endregion batches

//#region docs
/**
 * Gets a zip archive with all documents
 *
 * @see https://otpravka.pochta.ru/specification#/documents-create_all_docs
 */
const getDocs = async (batchName, outputPath, { printType, printTypeForm } = {}) => {
	let url = `https://otpravka-api.pochta.ru/1.0/forms/${batchName}/zip-all?`;
	url += printType ? `print-type=${printType}` : "";
	url += printTypeForm ? `&print-form-type=${printTypeForm}` : "";

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const fileStream = fs.createWriteStream(outputPath);
		await new Promise((resolve, reject) => {
			response.body.pipe(fileStream);

			response.body.on("error", reject);
			fileStream.on("finish", resolve);
		});

		if (response.status === 400)
			return {
				error: "400 bad request",
				data: null,
			};

		return {
			error: null,
			data: "downloaded",
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets a f7p form (PDF) for specified order
 *
 * @see https://otpravka.pochta.ru/specification#/documents-create_f7_f22
 */
const getF7P = async (id, outputPath, { sendingDate, printType } = {}) => {
	let url = `https://otpravka-api.pochta.ru/1.0/forms/${id}/f7pdf?`;
	url += sendingDate ? `sending-date=${sendingDate}` : "";
	url += printType ? `&print-type=${printType}` : "";

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const fileStream = fs.createWriteStream(outputPath);
		await new Promise((resolve, reject) => {
			response.body.pipe(fileStream);

			response.body.on("error", reject);
			fileStream.on("finish", resolve);
		});

		if (response.status === 400)
			return {
				error: "400 bad request",
				data: null,
			};

		return {
			error: null,
			data: "downloaded",
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets a f112 form (PDF) for specified order
 *
 * @see https://otpravka.pochta.ru/specification#/documents-create_f112
 */
const getF112 = async (id, outputPath, { sendingDate } = {}) => {
	let url = `https://otpravka-api.pochta.ru/1.0/forms/${id}/f112pdf?`;
	url += sendingDate ? `sending-date=${sendingDate}` : "";

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const fileStream = fs.createWriteStream(outputPath);
		await new Promise((resolve, reject) => {
			response.body.pipe(fileStream);

			response.body.on("error", reject);
			fileStream.on("finish", resolve);
		});

		if (response.status === 400)
			return {
				error: "400 bad request",
				data: null,
			};

		return {
			error: null,
			data: "downloaded",
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets a zip archive with all documents for a spicific order.
 * Works only for specific types of parcels in specific situations.
 * Will not work unless you know exactly what you are doing.
 * Instead, put your orders into batches and use getDocs method.
 *
 * @see https://otpravka.pochta.ru/specification#/documents-create_forms_backlog
 */
const getDocsByOrderId = async (id, outputPath, { sendingDate } = {}) => {
	let url = `https://otpravka-api.pochta.ru/1.0/forms/backlog/${id}/forms?`;
	url += sendingDate ? `sending-date=${sendingDate}` : "";

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const fileStream = fs.createWriteStream(outputPath);
		await new Promise((resolve, reject) => {
			response.body.pipe(fileStream);

			response.body.on("error", reject);
			fileStream.on("finish", resolve);
		});

		if (response.status === 400)
			return {
				error: "400 bad request",
				data: null,
			};

		return {
			error: null,
			data: "downloaded",
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets a variety of forms (PDF) depending on order's type.
 *
 * @see https://otpravka.pochta.ru/specification#/documents-create_forms
 */
const getForms = async (id, outputPath, { sendingDate, printType } = {}) => {
	let url = `https://otpravka-api.pochta.ru/1.0/forms/${id}/forms?`;
	url += sendingDate ? `sending-date=${sendingDate}` : "";
	url += printType ? `&print-type=${printType}` : "";

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const fileStream = fs.createWriteStream(outputPath);
		await new Promise((resolve, reject) => {
			response.body.pipe(fileStream);

			response.body.on("error", reject);
			fileStream.on("finish", resolve);
		});

		if (response.status === 400)
			return {
				error: "400 bad request",
				data: null,
			};

		return {
			error: null,
			data: "downloaded",
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets a f103 form (PDF) for a specified batch
 *
 * @see https://otpravka.pochta.ru/specification#/documents-create_f103
 */
const getF103 = async (batchName, outputPath) => {
	try {
		const response = await fetch(`https://otpravka-api.pochta.ru/1.0/forms/${batchName}/f103pdf`, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const fileStream = fs.createWriteStream(outputPath);
		await new Promise((resolve, reject) => {
			response.body.pipe(fileStream);

			response.body.on("error", reject);
			fileStream.on("finish", resolve);
		});

		if (response.status === 400)
			return {
				error: "400 bad request",
				data: null,
			};

		return {
			error: null,
			data: "downloaded",
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Sends batch's info to post office
 *
 * @see https://otpravka.pochta.ru/specification#/documents-checkin
 */
const checkin = async (batchName, { useOnlineBalance } = {}) => {
	let url = `https://otpravka-api.pochta.ru/1.0/batch/${batchName}/checkin`;
	url += useOnlineBalance ? "?useOnlineBalance=true" : "";

	try {
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const result = await response.json();

		return {
			error: null,
			data: result,
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets a completeness check form (PDF) for a specified batch
 *
 * @see https://otpravka.pochta.ru/specification#/documents-create_comp_check_form
 */
const getCompCheckForm = async (batchName, outputPath) => {
	try {
		const response = await fetch(
			`https://otpravka-api.pochta.ru/1.0/forms/${batchName}/completeness-checking-form`,
			{
				method: "GET",
				headers: {
					Authorization: `AccessToken ${otpravka.token}`,
					"X-User-Authorization": `Basic ${otpravka.key}`,
					"Content-Type": "application/json;charset=UTF-8",
				},
			}
		);

		const fileStream = fs.createWriteStream(outputPath);
		await new Promise((resolve, reject) => {
			response.body.pipe(fileStream);

			response.body.on("error", reject);
			fileStream.on("finish", resolve);
		});

		if (response.status === 400)
			return {
				error: "400 bad request",
				data: null,
			};

		return {
			error: null,
			data: "downloaded",
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};

/**
 * Gets a return form (PDF) for a specified order
 *
 * @see https://otpravka.pochta.ru/specification#/documents-easy_return_pdf
 */
const getReturnForm = async (id, outputPath, { printType } = {}) => {
	let url = `https://otpravka-api.pochta.ru/1.0/forms/${id}/easy-return-pdf?`;
	url += printType ? `print-type=${printType}` : "";

	try {
		const response = await fetch(url, {
			method: "GET",
			headers: {
				Authorization: `AccessToken ${otpravka.token}`,
				"X-User-Authorization": `Basic ${otpravka.key}`,
				"Content-Type": "application/json;charset=UTF-8",
			},
		});

		const fileStream = fs.createWriteStream(outputPath);
		await new Promise((resolve, reject) => {
			response.body.pipe(fileStream);

			response.body.on("error", reject);
			fileStream.on("finish", resolve);
		});

		if (response.status === 400)
			return {
				error: "400 bad request",
				data: null,
			};

		return {
			error: null,
			data: "downloaded",
		};
	} catch (error) {
		return {
			error: error,
			data: null,
		};
	}
};
//#endregion docs

const otpravka = {
	token: null,
	key: null,
	auth: function (token, key) {
		this.token = token;
		this.key = key;
	},
	createOrders: createOrders,
	getOrderByShopId: getOrderByShopId,
	getOrderByPostId: getOrderByPostId,
	editOrder: editOrder,
	deleteOrders: deleteOrders,
	returnOrdersFromBatchToNew: returnOrdersFromBatchToNew,
	createBatch: createBatch,
	changeBatchSendingDate: changeBatchSendingDate,
	addExistingOrdersToExistingBatch: addExistingOrdersToExistingBatch,
	getBatchInfoByName: getBatchInfoByName,
	getOrderInfoByTrackId: getOrderInfoByTrackId,
	addNewOrdersToExistingBatch: addNewOrdersToExistingBatch,
	removeOrdersFromBatch: removeOrdersFromBatch,
	getOrdersInfoByBatchName: getOrdersInfoByBatchName,
	getBatches: getBatches,
	getOrderInfoById: getOrderInfoById,
	getDocs: getDocs,
	getF7P: getF7P,
	getF112: getF112,
	getDocsByOrderId: getDocsByOrderId,
	getForms: getForms,
	getF103: getF103,
	checkin: checkin,
	getCompCheckForm: getCompCheckForm,
	getReturnForm: getReturnForm,
};

module.exports = otpravka;
