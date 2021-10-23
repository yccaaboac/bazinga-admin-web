import request from "@/utils/request";

export function getAllCategory() {
  return request({
    url: "api/picCategories/all",
    method: "get",
  });
}

export function add(data) {
  return request({
    url: "api/picCategories",
    method: "post",
    data,
  });
}

export function edit(data) {
  return request({
    url: "api/picCategories",
    method: "put",
    data,
  });
}

export function del(ids) {
  return request({
    url: "api/picCategories",
    method: "delete",
    data: ids,
  });
}
export default { add, del, edit };
