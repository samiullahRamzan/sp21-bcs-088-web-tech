const Customer = require("../models/Customer");
// const mongoose = require("mongoose");

exports.getCalculate = async (req, res) => {
  try {
    res.render("calculate");
  } catch (error) {
    console.log(error);
  }
};

exports.postCalculate = async (req, res) => {
  try {
    const { operand1, operand2, operation } = req.body;
    console.log(operation);
    // convert operand1 and operand2 into number
    let firstValue = parseFloat(operand1);
    let secondValue = parseFloat(operand2);
    let result;

    if (operation == "add") {
      result = firstValue + secondValue;
    } else if (operation == "subtract") {
      result = firstValue - secondValue;
    } else if (operation == "multiply") {
      result = firstValue * secondValue;
    } else if (operation == "divide") {
      result = firstValue / secondValue;
    } else {
      result = "inavalid operation";
    }

    //calculation in session
    req.session.results = req.session.results || [];
    req.session.results.push({
      firstValue,
      secondValue,
      operation,
      result,
    });

    res.redirect("/calculate");
  } catch (error) {
    console.log(error);
  }
};
/**
 * GET /
 * Homepage
 */
exports.homepage = async (req, res) => {
  let perPage = 2;
  let page = req.query.page || 1;

  try {
    const customers = await Customer.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: perPage * page - perPage },
      { $limit: perPage },
    ]);

    const count = await Customer.countDocuments({});

    res.render("index", {
      customers,
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
  }
};

// exports.homepage = async (req, res) => {
//     const messages = await req.consumeFlash('info');
//     const locals = {
//       title: 'NodeJs',
//       description: 'Free NodeJs User Management System'
//     }

//     try {
//       const customers = await Customer.find({}).limit(22);
//       res.render('index', { locals, messages, customers } );
//     } catch (error) {
//       console.log(error);
//     }
// }

/**
 * GET /
 * About
 */
exports.about = async (req, res) => {
  try {
    res.render("about");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * New Customer Form
 */
exports.addCustomer = async (req, res) => {
  res.render("customer/add");
};

/**
 * POST /
 * Create New Customer
 */
exports.postCustomer = async (req, res) => {
  console.log(req.body);

  const newCustomer = new Customer({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    details: req.body.details,
    tel: req.body.tel,
    email: req.body.email,
  });

  try {
    await Customer.create(newCustomer);
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Customer Data
 */
exports.view = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });

    res.render("customer/view", {
      customer,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Edit Customer Data
 */
exports.edit = async (req, res) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id });

    res.render("customer/edit", {
      customer,
    });
  } catch (error) {
    console.log(error);
  }
};

/**
 * GET /
 * Update Customer Data
 */
exports.editPost = async (req, res) => {
  try {
    await Customer.findByIdAndUpdate(req.params.id, {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      tel: req.body.tel,
      email: req.body.email,
      details: req.body.details,
      updatedAt: Date.now(),
    });
    await res.redirect(`/edit/${req.params.id}`);

    console.log("redirected");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Delete /
 * Delete Customer Data
 */
exports.deleteCustomer = async (req, res) => {
  try {
    await Customer.deleteOne({ _id: req.params.id });
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

/**
 * Get /
 * Search Customer Data
 */
exports.searchCustomers = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const customers = await Customer.find({
      $or: [
        { firstName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
        { lastName: { $regex: new RegExp(searchNoSpecialChar, "i") } },
      ],
    });

    res.render("search", {
      customers,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
};
