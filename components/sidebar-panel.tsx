"use client";

import { useState } from "react";
import {
  IconSearch,
  IconArrowsExchange,
  IconRefresh,
  IconBuildingWarehouse,
  IconBuildingFactory2,
  IconMotorbike,
  IconAlertTriangle,
  IconCircleCheck,
  IconBattery3,
  IconArrowLeft,
} from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export interface SelectedLocation {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  manager: string;
  color: string;
}

interface ActivityLog {
  id: string;
  time: string;
  type: "swap" | "charge" | "retrofit" | "depot" | "production" | "rider" | "alert";
  message: string;
  location: string;
}

const activityLogs: ActivityLog[] = [
  // Ebute Metta
  { id: "log-1", time: "2 min ago", type: "swap", message: "Battery swap completed", location: "Ebute Metta" },
  { id: "log-26", time: "1 hr ago", type: "swap", message: "Battery swap completed", location: "Ebute Metta" },
  { id: "log-27", time: "3 hrs ago", type: "alert", message: "Battery inventory restocked", location: "Ebute Metta" },
  { id: "log-28", time: "5 hrs ago", type: "swap", message: "12 swaps completed this shift", location: "Ebute Metta" },

  // Lekki Phase 1
  { id: "log-2", time: "5 min ago", type: "rider", message: "Rider #1042 checked in", location: "Lekki Phase 1" },
  { id: "log-29", time: "45 min ago", type: "swap", message: "Battery swap completed", location: "Lekki Phase 1" },
  { id: "log-30", time: "2 hrs ago", type: "rider", message: "Rider #0812 completed 8 deliveries", location: "Lekki Phase 1" },
  { id: "log-31", time: "4 hrs ago", type: "alert", message: "Station opened for the day", location: "Lekki Phase 1" },

  // Festac
  { id: "log-3", time: "8 min ago", type: "alert", message: "Low battery inventory", location: "Festac" },
  { id: "log-32", time: "1.5 hrs ago", type: "swap", message: "Battery swap completed", location: "Festac" },
  { id: "log-33", time: "3 hrs ago", type: "swap", message: "6 swaps completed this shift", location: "Festac" },
  { id: "log-34", time: "6 hrs ago", type: "depot", message: "Batteries delivered from depot", location: "Festac" },

  // Sabo Yaba
  { id: "log-4", time: "12 min ago", type: "charge", message: "15 batteries fully charged", location: "Sabo Yaba" },
  { id: "log-35", time: "1 hr ago", type: "charge", message: "8 batteries plugged in", location: "Sabo Yaba" },
  { id: "log-36", time: "2.5 hrs ago", type: "alert", message: "Charging bay 3 back online", location: "Sabo Yaba" },
  { id: "log-37", time: "5 hrs ago", type: "charge", message: "20 batteries fully charged", location: "Sabo Yaba" },

  // Ikeja (Retrofit)
  { id: "log-5", time: "15 min ago", type: "retrofit", message: "Vehicle retrofit completed", location: "Ikeja" },
  { id: "log-38", time: "2 hrs ago", type: "retrofit", message: "New vehicle intake registered", location: "Ikeja" },
  { id: "log-39", time: "4 hrs ago", type: "retrofit", message: "Quality inspection passed", location: "Ikeja" },

  // Maryland
  { id: "log-6", time: "18 min ago", type: "swap", message: "Battery swap completed", location: "Maryland" },
  { id: "log-40", time: "50 min ago", type: "swap", message: "Battery swap completed", location: "Maryland" },
  { id: "log-41", time: "2 hrs ago", type: "rider", message: "Rider #0923 checked in", location: "Maryland" },
  { id: "log-42", time: "4.5 hrs ago", type: "alert", message: "Station reopened after maintenance", location: "Maryland" },

  // Ikeja GRA (Depot)
  { id: "log-7", time: "22 min ago", type: "depot", message: "8 vehicles dispatched", location: "Ikeja GRA" },
  { id: "log-43", time: "1 hr ago", type: "depot", message: "Fleet inspection completed", location: "Ikeja GRA" },
  { id: "log-44", time: "3 hrs ago", type: "depot", message: "12 vehicles returned", location: "Ikeja GRA" },
  { id: "log-45", time: "6 hrs ago", type: "depot", message: "Morning dispatch — 15 vehicles", location: "Ikeja GRA" },

  // Agbara Industrial (Production)
  { id: "log-8", time: "25 min ago", type: "production", message: "Daily target reached — 56 units", location: "Agbara Industrial" },
  { id: "log-24", time: "3 hrs ago", type: "production", message: "Shift handover completed", location: "Agbara Industrial" },
  { id: "log-46", time: "5 hrs ago", type: "production", message: "Quality check passed — batch #45", location: "Agbara Industrial" },
  { id: "log-47", time: "8 hrs ago", type: "production", message: "Morning shift started — 22 workers", location: "Agbara Industrial" },

  // Command
  { id: "log-9", time: "30 min ago", type: "charge", message: "Charging station back online", location: "Command" },
  { id: "log-48", time: "2 hrs ago", type: "charge", message: "12 batteries fully charged", location: "Command" },
  { id: "log-49", time: "4 hrs ago", type: "alert", message: "Power outage reported", location: "Command" },

  // Egbeda
  { id: "log-10", time: "35 min ago", type: "rider", message: "Rider #0987 started shift", location: "Egbeda" },
  { id: "log-50", time: "1.5 hrs ago", type: "swap", message: "Battery swap completed", location: "Egbeda" },
  { id: "log-51", time: "3 hrs ago", type: "rider", message: "Rider #1021 checked in", location: "Egbeda" },
  { id: "log-52", time: "5 hrs ago", type: "swap", message: "9 swaps completed this shift", location: "Egbeda" },

  // Ikorodu (Retrofit)
  { id: "log-11", time: "40 min ago", type: "alert", message: "Station at full capacity", location: "Ikorodu" },
  { id: "log-53", time: "2 hrs ago", type: "retrofit", message: "Vehicle retrofit completed", location: "Ikorodu" },
  { id: "log-54", time: "4 hrs ago", type: "retrofit", message: "3 vehicles queued for retrofit", location: "Ikorodu" },

  // RCCG Camp
  { id: "log-12", time: "45 min ago", type: "swap", message: "Battery swap completed", location: "RCCG Camp" },
  { id: "log-55", time: "2 hrs ago", type: "swap", message: "Battery swap completed", location: "RCCG Camp" },
  { id: "log-56", time: "4 hrs ago", type: "rider", message: "Rider #1098 started shift", location: "RCCG Camp" },

  // Sango Ota
  { id: "log-13", time: "48 min ago", type: "retrofit", message: "New vehicle intake registered", location: "Sango Ota" },
  { id: "log-57", time: "3 hrs ago", type: "retrofit", message: "Vehicle retrofit completed", location: "Sango Ota" },
  { id: "log-58", time: "6 hrs ago", type: "retrofit", message: "Quality inspection passed", location: "Sango Ota" },

  // Mile 2 Hub (Depot)
  { id: "log-14", time: "52 min ago", type: "depot", message: "Inventory audit completed", location: "Mile 2 Hub" },
  { id: "log-59", time: "2 hrs ago", type: "depot", message: "6 vehicles dispatched", location: "Mile 2 Hub" },
  { id: "log-60", time: "5 hrs ago", type: "depot", message: "Battery delivery received", location: "Mile 2 Hub" },

  // Ikoyi
  { id: "log-15", time: "55 min ago", type: "charge", message: "10 batteries plugged in", location: "Ikoyi" },
  { id: "log-61", time: "2.5 hrs ago", type: "charge", message: "18 batteries fully charged", location: "Ikoyi" },
  { id: "log-62", time: "5 hrs ago", type: "charge", message: "Charging station opened", location: "Ikoyi" },

  // Ojota Manufacturing (Production)
  { id: "log-16", time: "1 hr ago", type: "production", message: "Quality check passed — batch #47", location: "Ojota Manufacturing" },
  { id: "log-63", time: "3 hrs ago", type: "production", message: "32 units assembled", location: "Ojota Manufacturing" },
  { id: "log-64", time: "6 hrs ago", type: "production", message: "Morning shift started — 18 workers", location: "Ojota Manufacturing" },

  // Ikorodu Town
  { id: "log-17", time: "1 hr ago", type: "swap", message: "Battery swap completed", location: "Ikorodu Town" },
  { id: "log-65", time: "2 hrs ago", type: "swap", message: "Battery swap completed", location: "Ikorodu Town" },
  { id: "log-66", time: "4 hrs ago", type: "rider", message: "Rider #0876 checked in", location: "Ikorodu Town" },

  // Warewa
  { id: "log-18", time: "1 hr ago", type: "rider", message: "Rider #1105 completed 12 deliveries", location: "Warewa" },
  { id: "log-67", time: "3 hrs ago", type: "charge", message: "8 batteries fully charged", location: "Warewa" },
  { id: "log-68", time: "5 hrs ago", type: "charge", message: "Station opened for the day", location: "Warewa" },

  // Sagamu Industrial Zone (Production)
  { id: "log-19", time: "1.5 hrs ago", type: "alert", message: "Maintenance scheduled", location: "Sagamu Industrial Zone" },
  { id: "log-69", time: "4 hrs ago", type: "production", message: "44 units assembled", location: "Sagamu Industrial Zone" },
  { id: "log-70", time: "7 hrs ago", type: "production", message: "Night shift handover completed", location: "Sagamu Industrial Zone" },

  // Surulere Central (Depot)
  { id: "log-20", time: "1.5 hrs ago", type: "depot", message: "14 vehicles returned", location: "Surulere Central" },
  { id: "log-71", time: "4 hrs ago", type: "depot", message: "10 vehicles dispatched", location: "Surulere Central" },
  { id: "log-72", time: "7 hrs ago", type: "depot", message: "Fleet maintenance completed", location: "Surulere Central" },

  // Atan Ota
  { id: "log-21", time: "2 hrs ago", type: "charge", message: "Power restored after outage", location: "Atan Ota" },
  { id: "log-73", time: "4 hrs ago", type: "alert", message: "Power outage — generator active", location: "Atan Ota" },
  { id: "log-74", time: "6 hrs ago", type: "charge", message: "14 batteries fully charged", location: "Atan Ota" },

  // Ota
  { id: "log-22", time: "2 hrs ago", type: "swap", message: "Battery swap completed", location: "Ota" },
  { id: "log-75", time: "4 hrs ago", type: "swap", message: "Battery swap completed", location: "Ota" },
  { id: "log-76", time: "6 hrs ago", type: "rider", message: "Rider #0954 checked in", location: "Ota" },

  // Mowe (Retrofit)
  { id: "log-23", time: "2.5 hrs ago", type: "retrofit", message: "Vehicle retrofit completed", location: "Mowe" },
  { id: "log-77", time: "5 hrs ago", type: "retrofit", message: "New vehicle intake registered", location: "Mowe" },
  { id: "log-78", time: "8 hrs ago", type: "retrofit", message: "2 vehicles queued for retrofit", location: "Mowe" },

  // Ikeja Along
  { id: "log-25", time: "3 hrs ago", type: "rider", message: "5 new riders onboarded", location: "Ikeja Along" },
  { id: "log-79", time: "5 hrs ago", type: "charge", message: "10 batteries fully charged", location: "Ikeja Along" },
  { id: "log-80", time: "7 hrs ago", type: "charge", message: "Station opened for the day", location: "Ikeja Along" },

  // Surulere (Retrofit)
  { id: "log-81", time: "1 hr ago", type: "retrofit", message: "Vehicle retrofit completed", location: "Surulere" },
  { id: "log-82", time: "3 hrs ago", type: "retrofit", message: "New vehicle intake registered", location: "Surulere" },
  { id: "log-83", time: "6 hrs ago", type: "retrofit", message: "Quality inspection passed", location: "Surulere" },

  // Amuwo Odofin
  { id: "log-84", time: "1 hr ago", type: "charge", message: "12 batteries fully charged", location: "Amuwo Odofin" },
  { id: "log-85", time: "3 hrs ago", type: "charge", message: "6 batteries plugged in", location: "Amuwo Odofin" },
  { id: "log-86", time: "5 hrs ago", type: "alert", message: "Charging bay 2 maintenance done", location: "Amuwo Odofin" },

  // Ijede
  { id: "log-87", time: "1.5 hrs ago", type: "charge", message: "9 batteries fully charged", location: "Ijede" },
  { id: "log-88", time: "4 hrs ago", type: "charge", message: "Station back online", location: "Ijede" },
  { id: "log-89", time: "7 hrs ago", type: "charge", message: "Station opened for the day", location: "Ijede" },

  // Loburo
  { id: "log-90", time: "2 hrs ago", type: "charge", message: "7 batteries fully charged", location: "Loburo" },
  { id: "log-91", time: "5 hrs ago", type: "charge", message: "5 batteries plugged in", location: "Loburo" },
  { id: "log-92", time: "8 hrs ago", type: "alert", message: "Maintenance completed", location: "Loburo" },

  // Ilupeju Ind
  { id: "log-93", time: "40 min ago", type: "charge", message: "11 batteries fully charged", location: "Ilupeju Ind" },
  { id: "log-94", time: "3 hrs ago", type: "charge", message: "8 batteries plugged in", location: "Ilupeju Ind" },
  { id: "log-95", time: "6 hrs ago", type: "charge", message: "Station opened for the day", location: "Ilupeju Ind" },

  // Lekki Depot
  { id: "log-96", time: "1 hr ago", type: "depot", message: "5 vehicles dispatched", location: "Lekki Depot" },
  { id: "log-97", time: "3 hrs ago", type: "depot", message: "Battery delivery received", location: "Lekki Depot" },
  { id: "log-98", time: "6 hrs ago", type: "depot", message: "Fleet inspection completed", location: "Lekki Depot" },

  // Ikorodu Depot
  { id: "log-99", time: "1.5 hrs ago", type: "depot", message: "7 vehicles dispatched", location: "Ikorodu Depot" },
  { id: "log-100", time: "4 hrs ago", type: "depot", message: "Inventory audit completed", location: "Ikorodu Depot" },
  { id: "log-101", time: "7 hrs ago", type: "depot", message: "Morning dispatch — 10 vehicles", location: "Ikorodu Depot" },

  // Iyana Ipaja Hub (Depot)
  { id: "log-102", time: "2 hrs ago", type: "depot", message: "9 vehicles returned", location: "Iyana Ipaja Hub" },
  { id: "log-103", time: "5 hrs ago", type: "depot", message: "4 vehicles dispatched", location: "Iyana Ipaja Hub" },
  { id: "log-104", time: "8 hrs ago", type: "depot", message: "Fleet maintenance scheduled", location: "Iyana Ipaja Hub" },

  // Mowe Depot
  { id: "log-105", time: "2.5 hrs ago", type: "depot", message: "6 vehicles returned", location: "Mowe Depot" },
  { id: "log-106", time: "5 hrs ago", type: "depot", message: "Battery delivery received", location: "Mowe Depot" },
  { id: "log-107", time: "8 hrs ago", type: "depot", message: "Morning dispatch — 8 vehicles", location: "Mowe Depot" },

  // Ota Depot
  { id: "log-108", time: "3 hrs ago", type: "depot", message: "5 vehicles dispatched", location: "Ota Depot" },
  { id: "log-109", time: "6 hrs ago", type: "depot", message: "Fleet inspection completed", location: "Ota Depot" },
  { id: "log-110", time: "9 hrs ago", type: "depot", message: "Inventory audit completed", location: "Ota Depot" },

  // Rider — Adebayo Ogunlesi
  { id: "log-111", time: "10 min ago", type: "rider", message: "Started delivery to Yaba", location: "Adebayo Ogunlesi" },
  { id: "log-112", time: "45 min ago", type: "swap", message: "Battery swap at Sabo Yaba", location: "Adebayo Ogunlesi" },
  { id: "log-113", time: "2 hrs ago", type: "rider", message: "Completed 6 deliveries", location: "Adebayo Ogunlesi" },
  { id: "log-114", time: "4 hrs ago", type: "rider", message: "Shift started", location: "Adebayo Ogunlesi" },

  // Rider — Chiamaka Eze
  { id: "log-115", time: "20 min ago", type: "rider", message: "Arrived at Lekki Phase 1", location: "Chiamaka Eze" },
  { id: "log-116", time: "1 hr ago", type: "rider", message: "Completed 4 deliveries", location: "Chiamaka Eze" },
  { id: "log-117", time: "3 hrs ago", type: "swap", message: "Battery swap at Lekki Phase 1", location: "Chiamaka Eze" },
  { id: "log-118", time: "5 hrs ago", type: "rider", message: "Shift started", location: "Chiamaka Eze" },

  // Rider — Ifeanyi Nwosu
  { id: "log-119", time: "15 min ago", type: "rider", message: "En route to Festac delivery", location: "Ifeanyi Nwosu" },
  { id: "log-120", time: "1.5 hrs ago", type: "swap", message: "Battery swap at Festac", location: "Ifeanyi Nwosu" },
  { id: "log-121", time: "3 hrs ago", type: "rider", message: "Completed 7 deliveries", location: "Ifeanyi Nwosu" },
  { id: "log-122", time: "6 hrs ago", type: "rider", message: "Shift started", location: "Ifeanyi Nwosu" },

  // Rider — Oluwaseun Bakare
  { id: "log-123", time: "5 min ago", type: "charge", message: "Battery charging at Ikorodu", location: "Oluwaseun Bakare" },
  { id: "log-124", time: "1 hr ago", type: "rider", message: "Completed 9 deliveries", location: "Oluwaseun Bakare" },
  { id: "log-125", time: "2.5 hrs ago", type: "swap", message: "Battery swap at Ikorodu Town", location: "Oluwaseun Bakare" },
  { id: "log-126", time: "5 hrs ago", type: "rider", message: "Shift started", location: "Oluwaseun Bakare" },

  // Rider — Fatimah Abdullahi
  { id: "log-127", time: "8 min ago", type: "rider", message: "En route to Egbeda delivery", location: "Fatimah Abdullahi" },
  { id: "log-128", time: "1 hr ago", type: "swap", message: "Battery swap at Egbeda", location: "Fatimah Abdullahi" },
  { id: "log-129", time: "3 hrs ago", type: "rider", message: "Completed 5 deliveries", location: "Fatimah Abdullahi" },
  { id: "log-130", time: "5.5 hrs ago", type: "rider", message: "Shift started", location: "Fatimah Abdullahi" },

  // Rider — Taiwo Adeniyi
  { id: "log-131", time: "6 min ago", type: "rider", message: "En route to Ikeja delivery", location: "Taiwo Adeniyi" },
  { id: "log-132", time: "1 hr ago", type: "rider", message: "Completed 3 deliveries", location: "Taiwo Adeniyi" },

  // Rider — Blessing Okonkwo
  { id: "log-133", time: "12 min ago", type: "rider", message: "Pickup from Lekki Phase 1", location: "Blessing Okonkwo" },
  { id: "log-134", time: "2 hrs ago", type: "rider", message: "Completed 4 deliveries", location: "Blessing Okonkwo" },

  // Rider — Musa Danjuma
  { id: "log-135", time: "25 min ago", type: "rider", message: "Arrived at Surulere station", location: "Musa Danjuma" },
  { id: "log-136", time: "3 hrs ago", type: "rider", message: "Shift started", location: "Musa Danjuma" },

  // Rider — Chidinma Obi
  { id: "log-137", time: "4 min ago", type: "rider", message: "En route to Agege delivery", location: "Chidinma Obi" },
  { id: "log-138", time: "1.5 hrs ago", type: "swap", message: "Battery swap at Ikeja", location: "Chidinma Obi" },

  // Rider — Kehinde Balogun
  { id: "log-139", time: "18 min ago", type: "charge", message: "Battery charging at Sabo Yaba", location: "Kehinde Balogun" },
  { id: "log-140", time: "2 hrs ago", type: "rider", message: "Completed 7 deliveries", location: "Kehinde Balogun" },

  // Rider — Ngozi Emenike
  { id: "log-141", time: "9 min ago", type: "rider", message: "En route to V/I delivery", location: "Ngozi Emenike" },
  { id: "log-142", time: "2 hrs ago", type: "rider", message: "Completed 5 deliveries", location: "Ngozi Emenike" },

  // Rider — Yusuf Abubakar
  { id: "log-143", time: "14 min ago", type: "rider", message: "En route to Agbado delivery", location: "Yusuf Abubakar" },
  { id: "log-144", time: "3 hrs ago", type: "rider", message: "Shift started", location: "Yusuf Abubakar" },

  // Rider — Aisha Mohammed
  { id: "log-145", time: "32 min ago", type: "rider", message: "Waiting at Festac station", location: "Aisha Mohammed" },
  { id: "log-146", time: "4 hrs ago", type: "rider", message: "Shift started", location: "Aisha Mohammed" },

  // Rider — Emmanuel Okafor
  { id: "log-147", time: "7 min ago", type: "rider", message: "En route to Ajah delivery", location: "Emmanuel Okafor" },
  { id: "log-148", time: "1 hr ago", type: "swap", message: "Battery swap at Lekki Phase 1", location: "Emmanuel Okafor" },

  // Rider — Funmilayo Ogundare
  { id: "log-149", time: "11 min ago", type: "rider", message: "En route to Ikeja GRA delivery", location: "Funmilayo Ogundare" },
  { id: "log-150", time: "2 hrs ago", type: "rider", message: "Completed 6 deliveries", location: "Funmilayo Ogundare" },

  // Rider — Chukwuemeka Ani
  { id: "log-151", time: "22 min ago", type: "charge", message: "Battery charging at Ikorodu", location: "Chukwuemeka Ani" },
  { id: "log-152", time: "3 hrs ago", type: "rider", message: "Completed 8 deliveries", location: "Chukwuemeka Ani" },

  // Rider — Halima Usman
  { id: "log-153", time: "5 min ago", type: "rider", message: "En route to Iyana Ipaja delivery", location: "Halima Usman" },
  { id: "log-154", time: "2 hrs ago", type: "rider", message: "Completed 4 deliveries", location: "Halima Usman" },

  // Rider — Obinna Eze
  { id: "log-155", time: "3 min ago", type: "rider", message: "Pickup from Yaba", location: "Obinna Eze" },
  { id: "log-156", time: "1.5 hrs ago", type: "rider", message: "Completed 5 deliveries", location: "Obinna Eze" },

  // Rider — Tolulope Adesanya
  { id: "log-157", time: "28 min ago", type: "rider", message: "Waiting at Maryland station", location: "Tolulope Adesanya" },
  { id: "log-158", time: "3.5 hrs ago", type: "rider", message: "Shift started", location: "Tolulope Adesanya" },

  // Rider — Segun Oladimeji (inactive)
  { id: "log-159", time: "2 hrs ago", type: "rider", message: "Shift ended — went offline", location: "Segun Oladimeji" },
  { id: "log-160", time: "6 hrs ago", type: "rider", message: "Completed 11 deliveries", location: "Segun Oladimeji" },

  // Rider — Amina Bello (inactive)
  { id: "log-161", time: "3 hrs ago", type: "rider", message: "Shift ended — went offline", location: "Amina Bello" },
  { id: "log-162", time: "7 hrs ago", type: "rider", message: "Completed 9 deliveries", location: "Amina Bello" },

  // Rider — Damilola Ogunbiyi (inactive)
  { id: "log-163", time: "1 hr ago", type: "rider", message: "Shift ended — went offline", location: "Damilola Ogunbiyi" },
  { id: "log-164", time: "5 hrs ago", type: "rider", message: "Completed 7 deliveries", location: "Damilola Ogunbiyi" },

  // Rider — Bisi Akande (technical issue)
  { id: "log-165", time: "35 min ago", type: "alert", message: "Vehicle motor fault — awaiting repair", location: "Bisi Akande" },
  { id: "log-166", time: "2 hrs ago", type: "rider", message: "Completed 3 deliveries before issue", location: "Bisi Akande" },

  // Rider — Ikechukwu Nnamdi (technical issue)
  { id: "log-167", time: "50 min ago", type: "alert", message: "Battery management error — stranded", location: "Ikechukwu Nnamdi" },
  { id: "log-168", time: "1.5 hrs ago", type: "rider", message: "Completed 6 deliveries before issue", location: "Ikechukwu Nnamdi" },
];

const logTypeConfig: Record<ActivityLog["type"], { icon: typeof IconArrowsExchange; color: string }> = {
  swap: { icon: IconArrowsExchange, color: "#2980b9" },
  charge: { icon: IconBattery3, color: "#27ae60" },
  retrofit: { icon: IconRefresh, color: "#e67e22" },
  depot: { icon: IconBuildingWarehouse, color: "#8e44ad" },
  production: { icon: IconBuildingFactory2, color: "#c0392b" },
  rider: { icon: IconMotorbike, color: "#3498db" },
  alert: { icon: IconAlertTriangle, color: "#e74c3c" },
};

const filterOptions = [
  { label: "All", value: "all" },
  { label: "Swaps", value: "swap" },
  { label: "Charging", value: "charge" },
  { label: "Retrofit", value: "retrofit" },
  { label: "Depots", value: "depot" },
  { label: "Production", value: "production" },
  { label: "Riders", value: "rider" },
  { label: "Alerts", value: "alert" },
];

interface SidebarPanelProps {
  selectedLocation?: SelectedLocation | null;
  onClose?: () => void;
}

function LogList({ logs }: { logs: ActivityLog[] }) {
  return (
    <>
      {logs.map((log) => {
        const config = logTypeConfig[log.type];
        const Icon = config.icon;

        return (
          <div
            key={log.id}
            className="flex gap-3 border-b border-border px-4 py-3 transition-colors hover:bg-muted/50"
          >
            <div
              className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: `${config.color}15` }}
            >
              <Icon className="size-3.5" style={{ color: config.color }} />
            </div>
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-sm">{log.message}</span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {log.location}
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  {log.time}
                </span>
              </div>
            </div>
          </div>
        );
      })}
      {logs.length === 0 && (
        <div className="px-4 py-8 text-center text-sm text-muted-foreground">
          No activity found.
        </div>
      )}
    </>
  );
}

function SidebarPanel({ selectedLocation, onClose }: SidebarPanelProps) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filtered = activityLogs.filter((log) => {
    const matchesSearch =
      !search ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.location.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === "all" || log.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  if (selectedLocation) {
    const locationLogs = activityLogs.filter(
      (log) => log.location.toLowerCase() === selectedLocation.name.toLowerCase()
    );

    return (
      <div className="flex h-full w-96 shrink-0 flex-col border-l border-border bg-background">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <button
            onClick={onClose}
            className="flex size-7 items-center justify-center rounded-md transition-colors hover:bg-muted"
          >
            <IconArrowLeft className="size-4" />
          </button>
          <span className="text-xs font-medium text-muted-foreground">
            {selectedLocation.type}
          </span>
        </div>

        <div className="border-b border-border px-4 py-4">
          <div className="flex items-center gap-2">
            <span
              className="inline-block size-3 shrink-0 rounded-full"
              style={{ backgroundColor: selectedLocation.color }}
            />
            <h2 className="text-sm font-semibold">{selectedLocation.name}</h2>
          </div>
          <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground">
            <span>
              {selectedLocation.latitude.toFixed(4)}, {selectedLocation.longitude.toFixed(4)}
            </span>
            <span>Manager: {selectedLocation.manager}</span>
          </div>
          <Badge variant="outline" className="mt-2">Active</Badge>
        </div>

        <div className="border-b border-border px-4 py-2">
          <h3 className="text-xs font-medium text-muted-foreground">
            Activity ({locationLogs.length})
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto">
          <LogList logs={locationLogs} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-96 shrink-0 flex-col border-l border-border bg-background">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold">Activity Log</h2>
          <p className="text-xs text-muted-foreground">
            {filtered.length} events
          </p>
        </div>
        <Badge variant="outline" className="gap-1">
          <IconCircleCheck className="size-3" />
          Live
        </Badge>
      </div>

      <div className="border-b border-border px-4 py-3">
        <div className="relative">
          <IconSearch className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search activity..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 border-b border-border px-4 py-3">
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveFilter(opt.value)}
            className={`px-2 py-0.5 text-xs transition-colors ${
              activeFilter === opt.value
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto">
        <LogList logs={filtered} />
      </div>
    </div>
  );
}

export { SidebarPanel };
