export const formatAddress = (data) => {
  return [
    data?.address,
    data?.city,
    data?.state,
    data?.pincode,
  ]
    .filter(Boolean)
    .join(", ") || "---";
};