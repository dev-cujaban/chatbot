import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

// Create an axios instance with default configuration
const axiosInstance = axios.create({
  baseURL: "http://localhost:3000", // Base URL for all requests
  headers: {
    "Content-Type": "application/json", // Default content type for requests
  },
});

// Custom axios client wrapping the axiosInstance for easier API calls
const axiosClient = {
  /**
   * Wrapper for GET requests
   * @param url - endpoint path to fetch
   * @param config - optional axios request configuration
   * @returns parsed response data of generic type T
   * @throws propagates any errors during the request
   */
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      // Perform GET request using the axiosInstance
      const response: AxiosResponse<T> = await axiosInstance.get(url, config);
      // Return only the response data payload
      return response.data;
    } catch (error) {
      // Log error for debugging purposes and rethrow it
      console.error("GET error:", error);
      throw error;
    }
  },

  /**
   * Wrapper for POST requests
   * @param url - endpoint path to send data to
   * @param data - request body payload
   * @param config - optional axios request configuration
   * @returns parsed response data of generic type T
   * @throws propagates any errors during the request
   */
  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      // Perform POST request using the axiosInstance
      const response: AxiosResponse<T> = await axiosInstance.post(
        url,
        data,
        config,
      );
      // Return only the response data payload
      return response.data;
    } catch (error) {
      // Log error for debugging purposes and rethrow it
      console.error("POST error:", error);
      throw error;
    }
  },
};

// Export the custom axios client for use in other parts of the app
export default axiosClient;
