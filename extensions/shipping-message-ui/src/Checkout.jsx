import {
  Banner,
  useSettings,
  reactExtension,
} from '@shopify/ui-extensions-react/checkout';

export default reactExtension(
  'purchase.checkout.shipping-option-list.render-before',
  () => <Extension />,
);

function Extension() {
  const settings = useSettings();

  if (!settings.enabled) return null;

  return (
    <Banner status="warning" title={settings.banner_title}>
		{settings.banner_text}
    </Banner>
  );
}