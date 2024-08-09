const db = require("../models");
const jwt_decode = require("jwt-decode");
const jwtKey = "g.comm";
const { logger } = require("../utils/util");
const Jwt = require("jsonwebtoken");
const { where, Op, Sequelize } = require("sequelize");
const organization = require("../models/organization");
const JWT_SECRET = process.env.JWT_Secret;
// const { logger } = require("../utils/util");

const Users = db.users;
const Categories = db.Categories;
const Posts = db.Posts;
const Organisations = db.Organisations;
const Approvers = db.Approvers;

// Helper function to convert HH:mm:ss time format to seconds
const convertTimeToSeconds = (time) => {
  const [hours, minutes, seconds] = time.split(":").map(Number);
  return hours * 3600 + minutes * 60 + seconds;
};

// Helper function to convert seconds to HH:mm:ss time format
const convertSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const getUserIdFromToken = (token) => {
  //   const authorizationHeader = req.headers["authorization"];

  try {
    const decodedToken = Jwt.verify(token, jwtKey);
    // console.log("ye hai user ki id", decodedToken.userId)
    return decodedToken.userId;
  } catch (error) {
    logger.error(error);

    console.error("Error decoding token:", error);
    return false;
  }

  return null; // Return null if token extraction fails
};

const verifyIfAdmin = async (token) => {
  try {
    const user_id = getUserIdFromToken(token);

    if (!user_id) {
      console.log("token expired", user_id);
      return false;
    }
    const total = await Users.findAll({
      where: { verified: true, id: user_id, role: "admin" },
    });
    if (total.length > 0) return true;
    else return false;
  } catch (error) {
    logger.error(error);

    console.log(error);
    return false;
  }
};

const TestContoller = async (req, res) => {
  try {
    res.json({ message: "test successful" });
  } catch (error) {
    logger.error(error);
  }
};

//DATA FETCHING API ...
const getTotalUsers = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }

    const total = await Users.findAll();
    res.json({ total: total.length });
  } catch (error) {
    logger.error(error);
  }
};

const getTotalOrganisation = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const total = await Organisations.findAll({ where: { isEnabled: true } });
    res.json({ total: total.length });
  } catch (error) {
    logger.error(error);
  }
};

const getTotalCategories = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const total = await Categories.findAll({ where: { isEnabled: true } });
    res.json({ total: total.length });
  } catch (error) {
    logger.error(error);
  }
};

const getTotalApprovedHours = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const all_posts = await Posts.findAll({ where: { approved: true } });
    // Calculate the sum of totalTime
    let totalTimeSum = 0;
    all_posts.forEach((post) => {
      totalTimeSum += convertTimeToSeconds(post.totalTime);
      // console.log(totalTimeSum, "time spent")
    });

    // Convert the total time sum back to HH:mm:ss format
    const formattedTotalTimeSum = convertSecondsToTime(totalTimeSum);
    res.json({ total: formattedTotalTimeSum });
  } catch (error) {
    logger.error(error);
  }
};

const getTotalRejectedHours = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const all_posts = await Posts.findAll({ where: { rejected: true } });
    let totalTimeSum = 0;
    all_posts.forEach((post) => {
      totalTimeSum += convertTimeToSeconds(post.totalTime);
      // console.log(totalTimeSum, "time spent")
    });

    // Convert the total time sum back to HH:mm:ss format
    const formattedTotalTimeSum = convertSecondsToTime(totalTimeSum);
    res.json({ total: formattedTotalTimeSum });
  } catch (error) {
    logger.error(error);
  }
};

const getTotalUnopenedHours = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const all_posts = await Posts.findAll({
      where: { rejected: false, approved: false },
    });
    let totalTimeSum = 0;
    all_posts.forEach((post) => {
      totalTimeSum += convertTimeToSeconds(post.totalTime);
      // console.log(totalTimeSum, "time spent")
    });

    // Convert the total time sum back to HH:mm:ss format
    const formattedTotalTimeSum = convertSecondsToTime(totalTimeSum);
    res.json({ total: formattedTotalTimeSum });
  } catch (error) {
    logger.error(error);
  }
};

const getTotalActivities = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const total = await Posts.findAll({ where: { approved: true } });
    res.json({ total: total.length });
  } catch (error) {
    logger.error(error);
  }
};

const getAllUsers = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const usersList = await Users.findAll({
      where: { role: "user" },
      order: [["id", "DESC"]],
    });
    res.json({ users: usersList });
  } catch (error) {
    logger.error(error);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const CategoryList = await Categories.findAll({
      order: [["id", "DESC"]],
    });
    res.json({ categories: CategoryList });
  } catch (error) {
    logger.error(error);
  }
};

const getAllCategoriesByStatus = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const status = req.params.status;
    const CategoryList = await Categories.findAll({
      where: { isEnabled: status },
      order: [["id", "DESC"]],
    });
    res.json({ categories: CategoryList });
  } catch (error) {
    logger.error(error);
  }
};

const getAllOrganization = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const OrganizationList = await Organisations.findAll({
      order: [["id", "DESC"]],
    });
    res.json({ organizations: OrganizationList });
  } catch (error) {
    logger.error(error);
  }
};

const getAllOrganizationByStatus = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const status = req.params.status;

    const OrganizationList = await Organisations.findAll({
      where: { isEnabled: status },
      order: [["id", "DESC"]],
    });
    res.json({ organizations: OrganizationList });
  } catch (error) {
    logger.error(error);
  }
};

const getAllApprovers = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const OrganizationList = await Approvers.findAll({
      order: [["id", "DESC"]],
    });
    res.json({ approvers: OrganizationList });
  } catch (error) {
    logger.error(error);
  }
};

const getAllApproversByStatus = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const status = req.params.status;

    const OrganizationList = await Approvers.findAll({
      where: { isEnabled: status },
      order: [["id", "DESC"]],
    });
    res.json({ approvers: OrganizationList });
  } catch (error) {
    logger.error(error);
  }
};
const getAllActivities = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const AcitvityList = await Posts.findAll({
      order: [["id", "DESC"]],
    });
    res.json({ activities: AcitvityList });
  } catch (error) {
    logger.error(error);
  }
};

const getAllActivitiesBy = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }

    let { filter, startDate, endDate, category } = req.body;

    let AcitvityList = null;

    const selectedCategory = category == "All" ? false : category;

    const start = startDate !== "NaN-NaN-NaN";
    const end = endDate !== "NaN-NaN-NaN";

    if (start && end) {
      console.log("both dates are present");

      let where = {
        Date: {
          [Op.between]: [startDate, endDate],
        },
        category: selectedCategory,
      };

      // Add filter condition only if filter is not null

      if (filter !== "All") {
        where[filter] = true;
      }
      AcitvityList = await Posts.findAll({
        where: where,
        order: [["id", "DESC"]],
      });
    } else {
      if (!end && !start) {
        let where = {
          category: selectedCategory,
        };
        if (filter !== "All") {
          where[filter] = true;
        }
        AcitvityList = await Posts.findAll({
          where: where,
        });
      } else {
        if (start) {
          console.log("start date is present ");
          let where = {
            Date: { [Op.gt]: startDate },
            category: selectedCategory,
          };
          if (filter !== "All") {
            where[filter] = true;
          }
          AcitvityList = await Posts.findAll({
            where: where,
            order: [["id", "DESC"]],
          });
        }
        if (end) {
          let where = {
            Date: { [Op.gt]: endDate },
            category: selectedCategory,
          };
          if (filter !== "All") {
            where[filter] = true;
          }
          AcitvityList = await Posts.findAll({
            where: where,
            order: [["id", "DESC"]],
          });
        }
      }
    }

    console.log(req.body, "body Data");
    console.log(AcitvityList, "Activity List");

    // const AcitvityList = await Posts.findAll({ where: {} });
    res.json({ activities: AcitvityList });
  } catch (error) {
    logger.error(error);

    console.log(error);
  }
};

const getAllActivityById = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const id = req.params.id;
    console.log(id, "id");
    const AcitvityList = await Posts.findAll({
      where: { id: id },
      order: [["id", "DESC"]],
      include: [
        {
          model: Users,
          attributes: ["name", "email"], // Include the fields you need from the Users table
        },
      ],
    });
    res.json({ activities: AcitvityList });
  } catch (error) {
    console.log(error, "activity by id");
  }
};
//DATA UPDATING API ..
const approveActivity = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    console.log(id, "id exist ");
    const AcitvityList = await Posts.update(
      { approved: true, rejected: 0 },
      { where: { id: id } }
    );
    res.json({ activities: AcitvityList });
  } catch (error) {
    logger.error(error);
  }
};

const rejectActivity = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    const AcitvityList = await Posts.update(
      { rejected: true, approved: 0 },
      { where: { id: id } }
    );
    res.json({ activities: AcitvityList });
    logger.error(error);
  } catch (error) {
    logger.error(error);
  }
};

const verifyUser = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    console.log(id, "id exist ");
    const verifiedUser = await Users.update(
      { verified: true },
      { where: { id: id } }
    );
    res.json({ user: verifiedUser });
  } catch (error) {
    logger.error(error);
  }
};

const unVerifyUser = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    console.log(id, "id exist ");
    const verifiedUser = await Users.update(
      { verified: false },
      { where: { id: id } }
    );
    res.json({ user: verifiedUser });
  } catch (error) {
    logger.error(error);
  }
};

const enableCategory = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    console.log(id, "id exist ");
    const categorylist = await Categories.update(
      { isEnabled: true },
      { where: { id: id } }
    );
    res.json({ categorylist: categorylist });
  } catch (error) {
    logger.error(error);
  }
};

const disableCategory = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    const categorylist = await Categories.update(
      { isEnabled: false },
      { where: { id: id } }
    );
    res.json({ categorylist: categorylist });
  } catch (error) {}
};

const enableOrganisation = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    console.log(id, "id exist ");
    const organisationList = await Organisations.update(
      { isEnabled: true },
      { where: { id: id } }
    );
    res.json({ organisations: organisationList });
  } catch (error) {
    logger.error(error);
  }
};

const disableOrganisation = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    const organisationList = await Organisations.update(
      { isEnabled: false },
      { where: { id: id } }
    );
    res.json({ organisations: organisationList });
  } catch (error) {
    logger.error(error);
  }
};

const enableApprover = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    console.log(id, "id exist ");
    const organisationList = await Approvers.update(
      { isEnabled: true },
      { where: { id: id } }
    );
    res.json({ approvers: organisationList });
  } catch (error) {
    logger.error(error);
  }
};

const disableApprover = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    id = req.params.id;
    const organisationList = await Approvers.update(
      { isEnabled: false },
      { where: { id: id } }
    );
    res.json({ approvers: organisationList });
  } catch (error) {
    logger.error(error);
  }
};

const getAllActivitiesByMonth = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Group and count activities by month
    const activitiesByMonth = await Posts.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],

      where: {
        createdAt: {
          [Sequelize.Op.gte]: new Date(currentYear, 0, 1),
          [Sequelize.Op.lt]: new Date(currentYear + 1, 0, 1),
        },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      order: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
    });

    // Convert the result to an object with month names
    const monthMap = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };

    const result = Object.keys(monthMap).reduce((acc, monthNumber) => {
      acc[monthMap[monthNumber]] = 0;
      return acc;
    }, {});

    // Update the result with actual counts from the database
    activitiesByMonth.forEach((item) => {
      const monthNumber = item.get("month");
      const monthName = monthMap[monthNumber];
      result[monthName] = item.get("count");
    });

    res.json(result);
  } catch (error) {
    logger.error(error);

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getApproveActivitiesByMonth = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Group and count activities by month
    const activitiesByMonth = await Posts.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],

      where: {
        createdAt: {
          [Sequelize.Op.gte]: new Date(currentYear, 0, 1),
          [Sequelize.Op.lt]: new Date(currentYear + 1, 0, 1),
        },
        approved: true,
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      order: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
    });

    // Convert the result to an object with month names
    const monthMap = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };

    const result = Object.keys(monthMap).reduce((acc, monthNumber) => {
      acc[monthMap[monthNumber]] = 0;
      return acc;
    }, {});

    // Update the result with actual counts from the database
    activitiesByMonth.forEach((item) => {
      const monthNumber = item.get("month");
      const monthName = monthMap[monthNumber];
      result[monthName] = item.get("count");
    });

    res.json(result);
  } catch (error) {
    logger.error(error);

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRejectedActivitiesByMonth = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Group and count activities by month
    const activitiesByMonth = await Posts.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],

      where: {
        createdAt: {
          [Sequelize.Op.gte]: new Date(currentYear, 0, 1),
          [Sequelize.Op.lt]: new Date(currentYear + 1, 0, 1),
        },
        rejected: true,
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      order: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
    });

    // Convert the result to an object with month names
    const monthMap = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };

    const result = Object.keys(monthMap).reduce((acc, monthNumber) => {
      acc[monthMap[monthNumber]] = 0;
      return acc;
    }, {});

    // Update the result with actual counts from the database
    activitiesByMonth.forEach((item) => {
      const monthNumber = item.get("month");
      const monthName = monthMap[monthNumber];
      result[monthName] = item.get("count");
    });

    res.json(result);
  } catch (error) {
    logger.error(error);

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUsersByMonth = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }

    // Get the current year
    const currentYear = new Date().getFullYear();

    // Group and count activities by month
    const activitiesByMonth = await Users.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: {
        createdAt: {
          [Sequelize.Op.gte]: new Date(currentYear, 0, 1),
          [Sequelize.Op.lt]: new Date(currentYear + 1, 0, 1),
        },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
      order: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
    });

    // Initialize the result object with all months set to 0
    const monthMap = {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December",
    };

    const result = Object.keys(monthMap).reduce((acc, monthNumber) => {
      acc[monthMap[monthNumber]] = 0;
      return acc;
    }, {});

    // Update the result with actual counts from the database
    activitiesByMonth.forEach((item) => {
      const monthNumber = item.get("month");
      const monthName = monthMap[monthNumber];
      result[monthName] = item.get("count");
    });

    res.json(result);
  } catch (error) {
    logger.error(error);

    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const addCategory = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const user_id = getUserIdFromToken(req.token);

    const category = req.body.category;
    const categoryList = await Categories.create({
      isEnabled: true,
      name: category,
    });
    res.json({ category: categoryList, message: "success" });
  } catch (error) {
    logger.error(error);

    console.log(error, "error in add category");
  }
};

const editCategory = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const user_id = getUserIdFromToken(req.token);
    const id = req.body.category_id;
    const category = req.body.category;
    const categoryList = await Categories.update(
      {
        name: category,
      },
      { where: { id: id } }
    );
    res.json({ category: categoryList, message: "success" });
  } catch (error) {
    logger.error(error);

    console.log(error, "error in add category");
  }
};

const addOrganization = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const user_id = getUserIdFromToken(req.token);

    const { name, email, phone, address, registration_number, password } =
      req.body;
    const orgList = await Organisations.create({
      isEnabled: true,
      name,
      email,
      phone,
      address,
      registration_number,
      password,
    });
    res.json({ organization: orgList, message: "success" });
  } catch (error) {
    logger.error(error);

    console.log(error, "error in add category");
  }
};

const editOrganization = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const user_id = getUserIdFromToken(req.token);

    const { name, email, phone, address, registration_number, password, id } =
      req.body;
    const orgList = await Organisations.update(
      {
        name,
        email,
        phone,
        address,
        registration_number,
        password,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({ organization: orgList, message: "success" });
  } catch (error) {
    logger.error(error);

    console.log(error, "error in add category");
  }
};

const addApprover = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const user_id = getUserIdFromToken(req.token);

    const { name, email, phone, address } = req.body;
    const orgList = await Approvers.create({
      isEnabled: true,
      name,
      email,
      phone,
      address,
    });
    res.json({ organization: orgList, message: "success" });
  } catch (error) {
    logger.error(error);

    console.log(error, "error in add category");
  }
};

const editApprover = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }
    const user_id = getUserIdFromToken(req.token);

    const { name, email, phone, address, id } = req.body;
    const orgList = await Approvers.update(
      {
        name,
        email,
        phone,
        address,
      },
      {
        where: {
          id: id,
        },
      }
    );
    res.json({ organization: orgList, message: "success" });
  } catch (error) {
    logger.error(error);

    console.log(error, "error in add category");
  }
};

const getAllActivitiesByCategories = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }

    const { categories, startDate, endDate } = req.body;

    // Validate categories input
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Invalid categories provided" });
    }

    // Initialize date filter
    const dateFilter = {};

    // Validate and add startDate and endDate to dateFilter if provided
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid start date format" });
      }
      dateFilter[Op.gte] = start.toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL format
      console.log("Start Date:", dateFilter[Op.gte]); // Debug log
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }
      // Set end date to the end of the specified day
      end.setHours(23, 59, 59, 999);
      dateFilter[Op.lte] = end.toISOString().slice(0, 19).replace("T", " "); // Convert to MySQL format
      console.log("End Date:", dateFilter[Op.lte]); // Debug log
    }

    // Debug log the dateFilter
    console.log("Date Filter:", dateFilter);
    console.log(
      "Date full in where:",
      Object.getOwnPropertySymbols(dateFilter).length
    );

    // Group and count activities by category
    const activitiesByCategories = await Posts.findAll({
      attributes: [
        "category",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: {
        ...(Object.getOwnPropertySymbols(dateFilter).length
          ? { createdAt: dateFilter }
          : {}),
        category: {
          [Op.in]: categories,
        },
      },
      group: ["category"],
    });

    // Prepare result object
    const result = {};

    // Populate result object with category counts
    activitiesByCategories.forEach((item) => {
      const category = item.get("category");
      const count = item.get("count");
      result[category] = count;
    });

    res.json(result);
  } catch (error) {
    console.error(error); // Debug log
    res.status(500).json({ message: "Internal server error" });
  }
};

const getRejectedActivitiesByCategories = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }

    const { categories, startDate, endDate } = req.body;

    // Validate categories input
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Invalid categories provided" });
    }

    // Initialize date filter
    const dateFilter = {};

    // Validate and add startDate and endDate to dateFilter if provided
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid start date format" });
      }
      dateFilter[Sequelize.Op.gte] = start
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }
      dateFilter[Sequelize.Op.lt] = end
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }

    // Group and count activities by category
    const activitiesByCategories = await Posts.findAll({
      attributes: [
        "category",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: {
        ...(Object.getOwnPropertySymbols(dateFilter).length
          ? { createdAt: dateFilter }
          : {}),
        rejected: true,
        category: {
          [Sequelize.Op.in]: categories,
        },
      },
      group: ["category"],
    });

    // Prepare result object
    const result = {};

    // Populate result object with category counts
    activitiesByCategories.forEach((item) => {
      const category = item.get("category");
      const count = item.get("count");
      result[category] = count;
    });

    res.json(result);
  } catch (error) {
    logger.error(error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getApprovedActivitiesByCategories = async (req, res) => {
  try {
    const ifAdmin = await verifyIfAdmin(req.token);
    // console.log("not an admin", ifAdmin);

    if (!ifAdmin) {
      return res.json({ message: "not an admin" });
    }

    const { categories, startDate, endDate } = req.body;

    // Validate categories input
    if (!Array.isArray(categories) || categories.length === 0) {
      return res.status(400).json({ message: "Invalid categories provided" });
    }

    // Initialize date filter
    const dateFilter = {};

    // Validate and add startDate and endDate to dateFilter if provided
    if (startDate) {
      const start = new Date(startDate);
      if (isNaN(start.getTime())) {
        return res.status(400).json({ message: "Invalid start date format" });
      }
      dateFilter[Sequelize.Op.gte] = start
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }

    if (endDate) {
      const end = new Date(endDate);
      if (isNaN(end.getTime())) {
        return res.status(400).json({ message: "Invalid end date format" });
      }
      dateFilter[Sequelize.Op.lt] = end
        .toISOString()
        .slice(0, 19)
        .replace("T", " ");
    }

    // Group and count activities by category
    const activitiesByCategories = await Posts.findAll({
      attributes: [
        "category",
        [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
      ],
      where: {
        ...(Object.getOwnPropertySymbols(dateFilter).length
          ? { createdAt: dateFilter }
          : {}),
        approved: true,
        category: {
          [Sequelize.Op.in]: categories,
        },
      },
      group: ["category"],
    });

    // Prepare result object
    const result = {};

    // Populate result object with category counts
    activitiesByCategories.forEach((item) => {
      const category = item.get("category");
      const count = item.get("count");
      result[category] = count;
    });

    res.json(result);
  } catch (error) {
    logger.error(error);
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyToken = async (req, res) => {
  try {
    const user_id = getUserIdFromToken(req.token);
    const total = await Users.findAll({
      where: { verified: true, id: user_id, role: "admin" },
    });
    if (total.length > 0) res.json({ verified: true });
    else res.json({ verified: false });
  } catch (error) {
    logger.error(error);

    console.log(error);
  }
};

module.exports = {
  TestContoller,
  getTotalUsers,
  verifyToken,
  getTotalActivities,
  getTotalCategories,
  getTotalOrganisation,
  getTotalApprovedHours,
  getTotalRejectedHours,
  getTotalUnopenedHours,
  getAllUsers,
  getAllCategories,
  getAllOrganization,
  getAllActivities,
  getAllActivityById,
  approveActivity,
  rejectActivity,
  getAllActivitiesBy,
  enableCategory,
  disableCategory,
  enableOrganisation,
  disableOrganisation,
  getAllActivitiesByMonth,
  getApproveActivitiesByMonth,
  getRejectedActivitiesByMonth,
  getAllUsersByMonth,
  getAllCategoriesByStatus,
  getAllOrganizationByStatus,
  getAllApproversByStatus,
  getAllApprovers,
  enableApprover,
  disableApprover,
  addCategory,
  addOrganization,
  editCategory,
  editOrganization,
  addApprover,
  editApprover,
  getAllActivitiesByCategories,
  getRejectedActivitiesByCategories,
  getApprovedActivitiesByCategories,
  verifyUser,
  unVerifyUser,
};