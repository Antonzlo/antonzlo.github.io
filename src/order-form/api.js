import { SUBMIT_ENDPOINT } from "./config";

export async function submitOrder(payload) {
	let response;
	try {
		response = await fetch(SUBMIT_ENDPOINT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload),
		});
	} catch (networkErr) {
		const error = new Error("network_error");
		error.type = "network";
		throw error;
	}

	const data = await response.json().catch(() => ({}));

	if (!response.ok || !data.success) {
		const error = new Error(data.message || "submit_failed");
		error.type = "server";
		error.details = data;
		throw error;
	}

	return data;
}
