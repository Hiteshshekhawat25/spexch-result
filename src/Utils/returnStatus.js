/**
 * Maps a status code to a user-friendly description.
 *
 * @param {string} status - The status code to be converted.
 * @returns {string} - The user-friendly description of the status, or the original status if no mapping exists.
 *
 * @example
 * // Returns "BALL RUNNING"
 * returnStatus("BALL_RUN");
 *
 * @example
 * // Returns "SUSPENDED"
 * returnStatus("SUSPEND");
 *
 * @example
 * // Returns "UNKNOWN_STATUS"
 * returnStatus("UNKNOWN_STATUS");
 */
export const returnStatus = (status) => {
  switch (status) {
    case "BALL_RUN":
      return "BALL RUNNING";
    case "SUSPEND":
      return "SUSPENDED";
    default:
      return status;
  }
};
