import request from "@/utils/request";

export function add(data) {
  return request({
    url: "api/blogs",
    method: "post",
    data,
  });
}

export function del(ids) {
  return request({
    url: "api/blogs",
    method: "delete",
    data: ids,
  });
}

export function edit(data) {
  return request({
    url: "api/blogs",
    method: "put",
    data,
  });
}

export function changeRelease(params) {
  return request({
    url: "api/blogs/changeRelease",
    method: "put",
    params,
  });
}

export default { add, edit, del, changeRelease };
