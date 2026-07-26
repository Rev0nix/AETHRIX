import api from "./api";

export const getMyOrders = async () => {
  const { data } = await api.get("/orders/myorders");
  return data.data;
};

export const getOrderById = async (id) => {
  const { data } = await api.get(`/orders/${id}`);
  return data.data;
};