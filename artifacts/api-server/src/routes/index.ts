import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products";
import pricesRouter from "./prices";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import categoriesRouter from "./categories";
import blogRouter from "./blog";
import statsRouter from "./stats";
import kycRouter from "./kyc";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/products", productsRouter);
router.use("/prices", pricesRouter);
router.use("/cart", cartRouter);
router.use("/orders", ordersRouter);
router.use("/categories", categoriesRouter);
router.use("/blog", blogRouter);
router.use("/stats", statsRouter);
router.use(kycRouter);

export default router;
