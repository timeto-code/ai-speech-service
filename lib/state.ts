// 文本转语音合成状态
export type ttsSynthesisStatusType = "pending" | "finished" | "canceled" | "error";
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
  isClosed() {
    return this.status === "finished" || this.status === "canceled" || this.status === "error";
  },
};
