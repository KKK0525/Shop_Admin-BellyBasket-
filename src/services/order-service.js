import HttpService from "./htttp.service";

class OrderService {

  getAll = async () => {
    const fetchOrderssEndpoint = '/api/v1/orders';
    return await HttpService.get(fetchOrderssEndpoint);
  };
  getAllCounts = async () => {
    const fetchOrdersCountsEndpoint = '/api/v1/orders/counts';
    return await HttpService.get(fetchOrdersCountsEndpoint);
  };
  updateStatus = async (orderId, payload) => {
    const updateStatusEndpoint = `/api/v1/orders/${orderId}/status`;
    return await HttpService.put(updateStatusEndpoint, payload);
  };

}

export default new OrderService();
