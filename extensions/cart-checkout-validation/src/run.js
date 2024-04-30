// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
	
	const errors = [];
	const email = input.cart.buyerIdentity?.email;
	const city = input.cart.deliveryGroups[0].deliveryAddress?.city || '';

	if( email?.includes("+") ) {
		errors.push({
			localizedMessage: "Email address must not include +",
			target: "$.cart.buyerIdentity.email",
		});
	}

	if ( city?.length > 50 ) {
		errors.push({
			localizedMessage: "City must not exceed 50 characters.",
			target: "$.cart.deliveryGroups[0].deliveryAddress.city",
		});
	}

	return {
		errors
	}
};