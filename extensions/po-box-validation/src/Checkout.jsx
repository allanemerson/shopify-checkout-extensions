import {
	Banner,
	reactExtension,
	useSettings,
	useShippingAddress,
	useBuyerJourneyIntercept,
} from "@shopify/ui-extensions-react/checkout";

export default reactExtension(
	"purchase.checkout.delivery-address.render-before",
	() => <Extension />
);

function Extension() {
	const settings = useSettings();
	const address = useShippingAddress();
	const INVALID = [
		"po box",
		"post office",
		"p o box",
		"p.o.box",
		"p.o. box",
		"p.o box",
		"pobox",
		"post office box",
		"post box",
		"p. o. box",
		"po. box",
		"postal box",
	];

	function blockLine(line) {
		for (i = 0; i < INVALID.length; i++) {
			if (line?.toLowerCase().includes(INVALID[i])) {
				return true;
			}
		}

		return false;
	}

	useBuyerJourneyIntercept(({ canBlockProgress }) => {
		if (!canBlockProgress) {
			return {
				behavior: "allow",
			};
		}
		if (blockLine(address?.address1)) {
			return {
				behavior: "block",
				reason: "Invalid address",
				errors: [
					{
						message: settings.error_message,
						target: "$.cart.deliveryGroups[0].deliveryAddress.address1",
					},
				],
			};
		}
		if (blockLine(address?.address2)) {
			return {
				behavior: "block",
				reason: "Invalid address",
				errors: [
					{
						message: settings.error_message,
						target: "$.cart.deliveryGroups[0].deliveryAddress.address2",
					},
				],
			};
		}
		return {
			behavior: "allow",
		};
	});
	return (
		<Banner status="warning" title={settings.banner_title}>
			{settings.banner_text}
		</Banner>
	);
}
