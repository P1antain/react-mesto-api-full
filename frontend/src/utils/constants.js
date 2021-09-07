const apiSettings = {
  url: "http://localhost:3000",
  token: `Bearer ${localStorage.getItem("jwt")}`
};

export { apiSettings };
