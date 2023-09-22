export default function useSubtotal(service, customFields, discount, tax) {
  const arrayOfSPrices = service.map((obj) => parseInt(obj.price));

  const serviceSubtotal =
    arrayOfSPrices.length > 0
      ? arrayOfSPrices.reduce((acc, prev) => acc + prev, 0)
      : 0;

  const arrayOfPrices = customFields.map((obj) =>
    parseInt(obj.customServicePrice * Math.abs(obj.qty))
  );

  const customFieldsSubtotal =
    arrayOfPrices.length > 0
      ? arrayOfPrices.reduce((total, price) => total + price, 0)
      : 0;

  let subTotal = serviceSubtotal + customFieldsSubtotal;

  if (discount > 0) {
    const decimalPercentage = discount / 100;
    subTotal = subTotal - decimalPercentage * subTotal;
  }

  if (tax > 0) {
    const decimalPercentage = tax / 100;
    subTotal = subTotal + decimalPercentage * subTotal;
  }

  return subTotal;
}
