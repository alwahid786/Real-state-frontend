/**
 * LocalStorage utilities for property search results
 */

const STORAGE_KEYS = {
  PROPERTY_SEARCH_RESULTS: "property_search_results",
  PROPERTY_SEARCH_FILTERS: "property_search_filters",
  SELECTED_PROPERTY: "selected_property",
};

/**
 * Save property search results to localStorage
 * @param {Array} properties - Array of property objects
 * @param {Object} filters - Search filters used
 */
export const savePropertySearchResults = (properties, filters = null) => {
  try {
    if (properties && Array.isArray(properties) && properties.length > 0) {
      localStorage.setItem(
        STORAGE_KEYS.PROPERTY_SEARCH_RESULTS,
        JSON.stringify(properties)
      );
      
      if (filters) {
        localStorage.setItem(
          STORAGE_KEYS.PROPERTY_SEARCH_FILTERS,
          JSON.stringify(filters)
        );
      }
      
      console.log(`💾 Saved ${properties.length} properties to localStorage`);
    }
  } catch (error) {
    console.error("Error saving property search results to localStorage:", error);
  }
};

/**
 * Load property search results from localStorage
 * @returns {Array|null} Array of property objects or null if not found
 */
export const loadPropertySearchResults = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROPERTY_SEARCH_RESULTS);
    if (stored) {
      const properties = JSON.parse(stored);
      console.log(`📦 Loaded ${properties.length} properties from localStorage`);
      return properties;
    }
  } catch (error) {
    console.error("Error loading property search results from localStorage:", error);
  }
  return null;
};

/**
 * Load search filters from localStorage
 * @returns {Object|null} Search filters object or null if not found
 */
export const loadPropertySearchFilters = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROPERTY_SEARCH_FILTERS);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading search filters from localStorage:", error);
  }
  return null;
};

/**
 * Clear property search results from localStorage
 */
export const clearPropertySearchResults = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROPERTY_SEARCH_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.PROPERTY_SEARCH_FILTERS);
    console.log("🗑️ Cleared property search results from localStorage");
  } catch (error) {
    console.error("Error clearing property search results from localStorage:", error);
  }
};

/**
 * Save selected property to localStorage
 * @param {Object} property - Selected property object
 */
export const saveSelectedProperty = (property) => {
  try {
    if (property) {
      localStorage.setItem(
        STORAGE_KEYS.SELECTED_PROPERTY,
        JSON.stringify(property)
      );
    }
  } catch (error) {
    console.error("Error saving selected property to localStorage:", error);
  }
};

/**
 * Load selected property from localStorage
 * @returns {Object|null} Selected property object or null if not found
 */
export const loadSelectedProperty = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SELECTED_PROPERTY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error loading selected property from localStorage:", error);
  }
  return null;
};

/**
 * Clear selected property from localStorage
 */
export const clearSelectedProperty = () => {
  try {
    localStorage.removeItem(STORAGE_KEYS.SELECTED_PROPERTY);
  } catch (error) {
    console.error("Error clearing selected property from localStorage:", error);
  }
};

/**
 * Check if property search results exist in localStorage
 * @returns {boolean} True if results exist
 */
export const hasPropertySearchResults = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROPERTY_SEARCH_RESULTS);
    return stored !== null && stored !== undefined;
  } catch (error) {
    return false;
  }
};

/**
 * Update a specific property in stored search results
 * @param {Object} updatedProperty - Updated property object
 * @param {Function} matchFn - Function to match the property (default: matches by _id or zpid)
 */
export const updatePropertyInSearchResults = (updatedProperty, matchFn = null) => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROPERTY_SEARCH_RESULTS);
    if (!stored) return false;

    const properties = JSON.parse(stored);
    
    // Default match function: match by _id or zpid
    const defaultMatchFn = (prop) => {
      return (
        (prop._id && updatedProperty._id && prop._id === updatedProperty._id) ||
        (prop.zpid && updatedProperty.zpid && prop.zpid === updatedProperty.zpid) ||
        (prop.id && updatedProperty.id && prop.id === updatedProperty.id)
      );
    };

    const match = matchFn || defaultMatchFn;
    let updated = false;

    const updatedProperties = properties.map((prop) => {
      if (match(prop)) {
        updated = true;
        // Merge updated property with existing property
        return { ...prop, ...updatedProperty };
      }
      return prop;
    });

    if (updated) {
      localStorage.setItem(
        STORAGE_KEYS.PROPERTY_SEARCH_RESULTS,
        JSON.stringify(updatedProperties)
      );
      console.log("🔄 Updated property in stored search results");
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error updating property in search results:", error);
    return false;
  }
};
