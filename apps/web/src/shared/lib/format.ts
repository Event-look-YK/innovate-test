export const formatDistanceKm = (km: number) =>
  `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 }).format(km)} km`;

export const formatWeightT = (t: number) =>
  `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 1 }).format(t)} t`;

export const formatCurrencyUah = (amount: number) =>
  new Intl.NumberFormat("uk-UA", { style: "currency", currency: "UAH", maximumFractionDigits: 0 }).format(
    amount,
  );

export const formatDuration = (hours: number) => {
  const wholeHours = Math.floor(hours);
  const mins = Math.round((hours - wholeHours) * 60);
  if (wholeHours <= 0) return `${mins}m`;
  if (mins <= 0) return `${wholeHours}h`;
  return `${wholeHours}h ${mins}m`;
};

export const formatRelativeTime = (isoDate: string) => {
  const diffMs = Date.now() - new Date(isoDate).getTime();
  const minutes = Math.floor(diffMs / (1000 * 60));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
