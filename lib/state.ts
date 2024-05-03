// 文本转语音合成状态
export type ttsSynthesisStatusType = "pending" | "finished" | "canceled" | "error" | "terminated";
export const ttsSynthesisStatus = {
  status: "finished" as ttsSynthesisStatusType,
  start() {
    this.status = "pending";
  },
  finished() {
    this.status = "finished";
  },
  canceled() {
    this.status = "canceled";
  },
  error() {
    this.status = "error";
  },
  terminated() {
    this.status = "terminated";
  },
  isClosed() {
    return this.status === "finished" || this.status === "canceled" || this.status === "error";
  },
  isTerminated() {
    // 通过前端取消
    return this.status === "terminated";
  },
};
