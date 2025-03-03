export const APIURLS = {
  login: "login",
  signup: "register",
  managepassword: (userid) => `managepassword?userid=${userid}`,
  forgotpassword: "forgotpassword",
  getUser: "getuser",
  getHistory: "history",
  getImages: (collectionid) => `getimages?collectionId=${collectionid}`,
  getTaskTray: "tasktray",
  reportImage: (imageId, reportReason, reportComment) =>
    `reportimage?imageId=${imageId}&reportReason=${reportReason}&reportComment=${reportComment}`,
  usageHistory: "usagehistory",
  deleteaccount: (username) => `deleteaccount?username=${username}`,
  selecttemplate: "selecttemplate",
  createBatch: "createbatch",
  uploadImage: "uploadins3",
  withtemplate: "withtemplate",
  withouttemplate: "withouttemplate",
  downloadImage: (batchId) => `downloadImages?batchId=${batchId}`,
  getPlans: "payments/getPlans",
  buyPlans: "payments/buyPlan",
  updatePayment: "payments/updatePayment",
};
