const express = require("express");
const customer = require("../controllers/customer.controller");
const book =  require("../controllers/book.controller");
const order = require("../controllers/order.controller");
const cart = require("../controllers/cart.controller");
const notify = require("../controllers/notify.controller");
const rate = require("../controllers/rate.controller");
const card = require("../controllers/card.controller");
const sup = require("../controllers/support.controller");
const router = express.Router();

router.route("/support")
    .post(sup.create)
    .put(sup.update)
    .delete(sup.deleteAll)
    .get(sup.findAll)
router.route("/support/:userName")
    .get(sup.find)
router.route("/support/find/:id")
    .get(sup.findById)
router.route("/support/:id")
    .delete(sup.delete)
router.route("/card")
    .post(card.checkCard)
    .delete(card.deleteAll)
router.route("/card/:id")
    .get(card.findAll)
    .delete(card.delete)
router.route("/rate")
    .post(rate.create)
    .put(rate.findOne)
    .get(rate.getAverageRating)
router.route("/rate/:id")
    .put(rate.update)
router.route("/rate/find/:bookId")
    .get(rate.getByBookId)
router.route("/cart/:username")
    .post(cart.create)
    .get(cart.findAll)
    .put(cart.update)
    .delete(cart.deleteAll)
    
router.route("/cart/:username/:bookId")
    .delete(cart.delete)

router.route("/customer")
    .post(customer.create)
    .get(customer.getIP);
router.route("/customers")
    .get(customer.findAll);
router.route("/customer/login")
    .post(customer.login);

router.route("/customer/:id")
     .put(customer.update)
     .get(customer.findOne)

router.route("/admin")
    .post(book.create)
    .delete(book.deleteAll)

router.route("/admin/:id")
    .put(book.update)
    .delete(book.delete)

router.route("/find")
    .get(book.findAll)

router.route("/find/:id")
    .get(book.findOne)

router.route("/order")
    .post(order.create)
    .get(order.getAll)
router.route("/ordersales")
    .get(order.getSuccessOrder)
router.route("/order/:username")
    .post(order.getUserOrder)
router.route("/order/update/:id")
    .put(order.update)
router.route("/order/find")
    .get(order.findById)
router.route("/notify")
    .get(notify.findAll)
    .post(notify.create)
    .delete(notify.deleteAll)
router.route("/notify/:username")
    .get(notify.findUser)
router.route("/notify/:id")
    .delete(notify.delete)
module.exports = router;
