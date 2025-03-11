export const apiClient = async (
    url: string,
    options: RequestInit = {}
  ): Promise<any> => {
    const token = localStorage.getItem("auth_token");
    const headers: HeadersInit = {
      ...(options.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BFF_URL}${url}`, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });
  
      if (!response.ok) {
        const errorResponse = await response.json().catch(() => null);
        throw new Error(
          errorResponse?.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }
  
      return response.json().catch(() => null);
    } catch (error) {
      console.error("Error in apiClient:", error);
      throw error;
    }
  };
  