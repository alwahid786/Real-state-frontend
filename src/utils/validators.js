export const validatePostalCode = (postalCode) => {
  if (!postalCode) return "Postal code is required";
  const postalRegex = /^\d{5}$/;
  if (!postalRegex.test(postalCode)) {
    return "Postal code must be 5 digits";
  }
  return null;
};

export const validateBeds = (beds) => {
  if (!beds) return "Beds is required";
  const num = parseInt(beds);
  if (isNaN(num) || num < 1 || num > 10) {
    return "Beds must be between 1 and 10";
  }
  return null;
};

export const validateBaths = (baths) => {
  if (!baths) return "Baths is required";
  const num = parseFloat(baths);
  if (isNaN(num) || num < 1 || num > 10) {
    return "Baths must be between 1 and 10";
  }
  return null;
};

export const validateSqft = (sqft) => {
  if (!sqft) return "Square footage is required";
  const num = parseInt(sqft);
  if (isNaN(num) || num < 100 || num > 10000) {
    return "Square footage must be between 100 and 10,000";
  }
  return null;
};

export const validatePriceRange = (minPrice, maxPrice) => {
  if (minPrice && maxPrice) {
    const min = parseFloat(minPrice);
    const max = parseFloat(maxPrice);
    if (!isNaN(min) && !isNaN(max) && max <= min) {
      return "Max price must be greater than min price";
    }
  }
  return null;
};

export const validateSearchForm = (filters) => {
  const errors = {};

  if (!filters.city?.trim()) {
    errors.city = "City is required";
  }

  if (!filters.state?.trim()) {
    errors.state = "State is required";
  }

  const postalError = validatePostalCode(filters.postalCode);
  if (postalError) errors.postalCode = postalError;

  const bedsError = validateBeds(filters.beds);
  if (bedsError) errors.beds = bedsError;

  const bathsError = validateBaths(filters.baths);
  if (bathsError) errors.baths = bathsError;

  const sqftError = validateSqft(filters.sqft);
  if (sqftError) errors.sqft = sqftError;

  const priceError = validatePriceRange(filters.minPrice, filters.maxPrice);
  if (priceError) errors.priceRange = priceError;

  return errors;
};
