import request from "@/utils/request";

export function getComments(params) {
  return request({
    url: "api/comments",
    method: "get",
    params,
  });
}

export default {
  getComments,
};
