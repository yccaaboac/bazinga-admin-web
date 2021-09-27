import request from "@/utils/request";

// 获取所有的Tag
export function getAllTag() {
  return request({
    url: "api/tags/all",
    method: "get",
  });
}

export function add(data) {
  return request({
    url: "api/tags",
    method: "post",
    data,
  });
}

export function edit(data) {
  return request({
    url: "api/tags",
    method: "put",
    data,
  });
}

export function del(ids) {
  return request({
    url: "api/tags",
    method: "delete",
    data: ids,
  });
}

export default { add, del, edit };
