import type { ServiceDetail } from "../data";

import { individualService } from "./individual";
import { couplesService } from "./couples";
import { familyService } from "./family";
import { childrenService } from "./children";
import { groupService } from "./group";
import { corporateService } from "./corporate";
import { consortiumService } from "./consortium";

export { serviceList } from "./service-list";

export const servicesBySlug: Record<string, ServiceDetail> = {
  individual: individualService,
  couples: couplesService,
  family: familyService,
  children: childrenService,
  group: groupService,
  corporate: corporateService,
  consortium: consortiumService,
};

export const serviceSlugs = Object.keys(servicesBySlug);

export function getServiceBySlug(slug: string): ServiceDetail | undefined {
  return servicesBySlug[slug];
}
