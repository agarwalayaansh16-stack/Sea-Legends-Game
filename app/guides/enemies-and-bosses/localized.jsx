"use client";

import { createLocalized } from "../../i18n-client";

export default createLocalized(() => import("./translations"));
