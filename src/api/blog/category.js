import request from "@/utils/request";

export function getAllCategory() {
  return request({
    url: "api/categories/all",
    method: "get",
  });
}

export default { getAllCategory };
