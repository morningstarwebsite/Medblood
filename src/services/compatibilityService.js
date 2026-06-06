const donorCompatibilityMap = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

const recipientCompatibilityMap = Object.fromEntries(
  Object.keys(donorCompatibilityMap).map((recipientCode) => {
    const compatibleDonors = Object.keys(donorCompatibilityMap).filter((donorCode) =>
      donorCompatibilityMap[donorCode].includes(recipientCode)
    );

    return [recipientCode, compatibleDonors];
  })
);

export const toBloodCode = (bloodGroup, rhesusFactor) => `${bloodGroup}${rhesusFactor}`;

export const getCompatibleRecipientsForDonor = (bloodGroup, rhesusFactor) => {
  const code = toBloodCode(bloodGroup, rhesusFactor);
  return donorCompatibilityMap[code] || [];
};

export const getCompatibleDonorsForRecipient = (bloodGroup, rhesusFactor) => {
  const code = toBloodCode(bloodGroup, rhesusFactor);
  return recipientCompatibilityMap[code] || [];
};
