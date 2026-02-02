export const formatCurrency = (value) => {
  if (!value && value !== 0) return "—";
  return `$${value.toLocaleString()}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return "—";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    return "—";
  }
};

export const formatNumber = (value) => {
  if (!value && value !== 0) return "—";
  return value.toLocaleString();
};

export const getDealScoreColor = (score) => {
  if (score >= 80) return "text-green-600";
  if (score >= 60) return "text-yellow-600";
  if (score >= 40) return "text-orange-600";
  return "text-red-600";
};

export const getDealScoreBgColor = (score) => {
  if (score >= 80) return "bg-green-100";
  if (score >= 60) return "bg-yellow-100";
  if (score >= 40) return "bg-orange-100";
  return "bg-red-100";
};

export const getRecommendationLabel = (recommendation) => {
  const labels = {
    "strong-deal": "Strong Deal ✅",
    "good-negotiate": "Good Deal - Negotiate 💰",
    "weak-lowball": "Weak Deal - Lowball ⚠️",
    pass: "Pass ❌",
  };
  return labels[recommendation] || recommendation;
};

export const getRecommendationVariant = (recommendation) => {
  if (recommendation === "strong-deal") return "bg-green-100 text-green-800";
  if (recommendation === "good-negotiate") return "bg-yellow-100 text-yellow-800";
  if (recommendation === "weak-lowball") return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
};

/**
 * Extract and normalize images from a property object
 * Handles different possible property names and formats
 */
export const getPropertyImages = (property) => {
  if (!property) return [];

  // Check multiple possible property names
  const imageSources = [
    property.images,
    property.imageUrls,
    property.photos,
    property.photoUrls,
    property.image,
    property.photo,
  ].filter(Boolean);

  if (imageSources.length === 0) return [];

  // Get the first valid image source
  let images = imageSources[0];

  // Convert to array if it's a single string
  if (typeof images === "string") {
    images = [images];
  }

  // Ensure it's an array
  if (!Array.isArray(images)) {
    return [];
  }

  // Filter out invalid URLs (empty strings, null, undefined)
  return images.filter((img) => {
    if (!img || typeof img !== "string") return false;
    const trimmed = img.trim();
    if (trimmed.length === 0) return false;
    // Basic URL validation - check if it looks like a URL
    return trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("data:");
  });
};

/**
 * Get the listing price from a property object
 * Handles different possible property names for price
 */
export const getPropertyPrice = (property) => {
  if (!property) return null;

  // Check multiple possible property names for listing price
  const price = property.price || property.listPrice || property.listingPrice || property.askingPrice;
  
  if (price !== null && price !== undefined) {
    return typeof price === "number" ? price : parseFloat(price);
  }

  return null;
};

/**
 * Get the sale price from a property object (if sold)
 */
export const getPropertySalePrice = (property) => {
  if (!property) return null;

  const salePrice = property.salePrice || property.lastSoldPrice || property.soldPrice;
  
  if (salePrice !== null && salePrice !== undefined) {
    return typeof salePrice === "number" ? salePrice : parseFloat(salePrice);
  }

  return null;
};

export const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
];
