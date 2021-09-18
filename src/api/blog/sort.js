import request from "@/utils/request";

export function getAllSort() {
  return request({
    url: "api/sorts/all",
    method: "get",
  });
}
