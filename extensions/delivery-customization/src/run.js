// @ts-check

/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const NO_CHANGES = {
	operations: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
	const TARGET_METHOD = "Contracted";
	let operations = [];

	input.cart.deliveryGroups.map((group) => {
		const contractedMethod = group.deliveryOptions.find((option) => {
			return option.title === TARGET_METHOD;
		});
		const otherMethods = group.deliveryOptions.filter((option) => {
			return option.title !== TARGET_METHOD;
		});

		// next two checks depend on the method, so bail if we don't have it
		if (!contractedMethod) {
			return false;
		}

		// if the customer is NET30, hide everything except Contracted
		if (input.cart.buyerIdentity?.customer?.hasTags[0].hasTag) {
			otherMethods.map((method) => {
				operations.push({
					hide: {
						deliveryOptionHandle: method.handle,
					},
				});
			});
		}
		// otherwise, hide Contracted
		else {
			operations.push({
				hide: {
					deliveryOptionHandle: contractedMethod?.handle,
				},
			});
		}
	});

	return {
		operations: operations,
	};
}
