/**
 * Helper untuk pagination
 * @param {number} page - Nomor halaman (default: 1)
 * @param {number} limit - Jumlah data per halaman (default: 10)
 * @returns {Object} - offset dan limit dalam bentuk integer
 */
const getPagination = (page = 1, limit = 10) => {
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  // Validasi input
  if (isNaN(parsedPage) || parsedPage < 1) {
    throw new Error("Page must be a positive integer");
  }

  if (isNaN(parsedLimit) || parsedLimit < 1) {
    throw new Error("Limit must be a positive integer");
  }

  const offset = (parsedPage - 1) * parsedLimit;

  return {
    offset,
    limit: parsedLimit,
  };
};

/**
 * Menghasilkan metadata pagination
 * @param {number} totalItems - Total jumlah data dari database
 * @param {number} page - Halaman saat ini
 * @param {number} limit - Jumlah data per halaman
 * @returns {Object} - Metadata pagination
 */
const getPagingData = (totalItems, page, limit) => {
  const totalPages = Math.ceil(totalItems / limit);

  return {
    total: totalItems,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
  };
};

module.exports = {
  getPagination,
  getPagingData,
};