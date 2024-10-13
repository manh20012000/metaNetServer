import { Router } from "express";
import { addTagname, getTagName } from "../controller/Tagname.controller.js";
const routeTagname = Router();
// routeTagname.get("/getTagname/:keyword", getTagName);
routeTagname.get("/getTagname", getTagName);
routeTagname.post("/addTagname", addTagname);
export default routeTagname;
