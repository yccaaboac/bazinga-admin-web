import request from "@/utils/request";

// 获取所有的Tag
export function getAllTag() {
  return request({
    url: "api/tags/all",
    method: "get",
  });
}
