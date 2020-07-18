const server = require("./server.js");
const db = require("../database/dbConfig.js");
const request = require("supertest");

beforeEach(async () => {
  await db("users").truncate();
});

describe("API", () => {
  describe("Register User", () => {
    it("should receive 201 when a user is successfuly registered", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "mosharraf", password: "123pass" })
        .then((res) => expect(res.status).toBe(201));
    });

    it("should receive 404 if a user does not input password", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "mosharraf" })
        .then((res) => expect(res.status).toBe(404));
    });

    it("should return username", function () {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "mosharraf", password: "123pass" })
        .then((res) => {
          expect(res.body.username).toEqual("mosharraf");
        });
    });

    it("Should return correct content type", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "mosharraf", password: "123pass" })
        .then((res) =>
          expect(res.headers["content-type"]).toBe(
            "application/json; charset=utf-8"
          )
        );
    });
  });

  //Test for login end point
  let cookies;
  let token;
  describe("Login", () => {
    it("should receive 401 if a user inputs incorrect password", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "mosharraf", password: "123pass" })
        .then((res) => {
          return request(server)
            .post("/api/auth/login")
            .send({ username: "mosharraf", password: "hacked" })
            .then((res) => expect(res.status).toBe(401));
        });
    });

    it("should receive 200 if a user inputs correct username and password", () => {
      return request(server)
        .post("/api/auth/register")
        .send({ username: "mosharraf", password: "123pass" })
        .then((res) => {
          return request(server)
            .post("/api/auth/login")
            .send({ username: "mosharraf", password: "123pass" })
            .then((res) => expect(res.status).toBe(200));
        });
    });
  });

  describe("Jokes", () => {
    it("should receive 400 if user does not give a JWT", () => {
      return request(server)
        .get("/api/jokes")
        .then((res) => expect(res.status).toBe(400));
    });

    it("should receive 400 if user gives a bad JWT", () => {
      return request(server)
        .get("/api/jokes")
        .send(
          "Authorization",
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
        )
        .then((res) => expect(res.status).toBe(400));
    });
  });
});
