import api from "./api";

export const resetSystemService = async (password) => {
  return await api.post("/admin/reset-system", { password });
};
