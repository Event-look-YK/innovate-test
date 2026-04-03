export const formatDistanceKm = (km: number) =>
  `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(km)} km`;

export const formatWeightT = (t: number) =>
  `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(t)} t`;

export const formatCurrencyUah = (amount: number) =>
  new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH", maximumFractionDigits: 0 }).format(
    amount,
  );
