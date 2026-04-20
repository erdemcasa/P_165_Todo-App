process.env.NODE_ENV = "test";
const { sequelize: db } = require("../config/database");
const { initModels } = require("../models");

beforeAll(async () => {
  await db.authenticate();
  global.models = initModels(db);
  await db.sync({ force: true });
});

beforeEach(async () => {
  // Truncate every model table
  // Cascade to handle FK constraints
  await Promise.all(
    Object.values(global.models)
      .filter((m) => m && typeof m.destroy === "function")
      .map((m) => m.destroy({ where: {}, truncate: true, cascade: true }))
  );
});

afterAll(async () => {
  await db.close();
});
