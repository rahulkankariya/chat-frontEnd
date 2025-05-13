
import { toast } from "react-toastify";

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method: HttpMethod;
  data?: any;
  headers?: Record<string, string>;
}

const APIURL = import.meta.env.VITE_API_URL;

const BASE_URL = APIURL + "api/v1/"
const apiService = {
  async request<T>(url: string, options: RequestOptions): Promise<ApiResponse<T>> {
    const { method, data, headers = {} } = options;

    const token = localStorage.getItem("token");

    try {
      const config: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...headers,
        },
      };

      if (data && (method === "POST" || method === "PUT")) {
        config.body = JSON.stringify(data);
      }

      const fullUrl = `${BASE_URL}${url.startsWith("/") ? url.slice(1) : url}`;
      const response = await fetch(fullUrl, config);
      const result = await response.json();



      if (response.status === 401) {
        // Unauthorized - handle logout
        localStorage.removeItem("token");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
        return { success: false, message: "Unauthorized" };
      }

      if (response.ok && result.status) {
        return { success: true, data: result.data || result };
      } else {
        toast.error(result.message || `${method} request failed`);
        return { success: false, message: result.message || `${method} request failed` };
      }
    } catch (error) {
      console.error(`${method} API Error:`, error);
      const message = "An error occurred. Please try again.";
      toast.error(message);
      return { success: false, message };
    }
  },

  get<T>(url: string, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "GET", headers });
  },

  post<T>(url: string, data: any, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "POST", data, headers });
  },

  put<T>(url: string, data: any, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "PUT", data, headers });
  },

  delete<T>(url: string, headers?: Record<string, string>) {
    return this.request<T>(url, { method: "DELETE", headers });
  },
};

export default apiService;
