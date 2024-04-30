// @ts-check

// Use JSDoc annotations for type safety
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

// The configured entrypoint for the 'purchase.payment-customization.run' extension target
/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
	// Find the payment method to hide
	const hidePaymentMethod = input.paymentMethods.find((method) =>
		method.name.includes("NET30")
	);
	// can't find the method, bail
	if (!hidePaymentMethod) {
		return NO_CHANGES;
	}

	const operations = [
		{
			hide: {
				paymentMethodId: hidePaymentMethod.id,
			},
		},
	];

	// don't have the customer yet
	if (!input.cart.buyerIdentity || !input.cart.buyerIdentity.customer) {
		return {
			operations: operations,
		};
	}

	// hasTags comes back as an array with a boolean for each objects, hasTag property,
	// but we only fetch one tag for this extension, so we can check that index directly
	if (!input.cart.buyerIdentity.customer.hasTags[0].hasTag) {
		return {
			operations: operations,
		};
	}

	// NET30 not allowed when the cart has Printify products
	const printifyLines = input.cart.lines.find((line) => {
		return line.merchandise.product.vendor === "Printify";
	});
	if (printifyLines) {
		return {
			operations: operations,
		};
	}

	// The @shopify/shopify_function package applies JSON.stringify() to your function result
	// and writes it to STDOUT
	return NO_CHANGES;
}
