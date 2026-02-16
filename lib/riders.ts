export interface Rider {
  id: string;
  name: string;
  longitude: number;
  latitude: number;
  status: "en-route" | "idle" | "charging" | "inactive" | "technical-issue";
  routeHistory: [number, number][];
}

export const riders: Rider[] = [
  // ── Active riders (19) ──────────────────────────────────────────────
  {
    id: "rider-1",
    name: "Adebayo Ogunlesi",
    longitude: 3.3795,
    latitude: 6.5248,
    status: "en-route",
    routeHistory: [
      [3.3860, 6.5050],
      [3.3795, 6.5248],
    ],
  },
  {
    id: "rider-2",
    name: "Chiamaka Eze",
    longitude: 3.4580,
    latitude: 6.4370,
    status: "idle",
    routeHistory: [
      [3.4500, 6.4320],
      [3.4580, 6.4370],
    ],
  },
  {
    id: "rider-3",
    name: "Ifeanyi Nwosu",
    longitude: 3.2830,
    latitude: 6.4700,
    status: "en-route",
    routeHistory: [
      [3.2920, 6.4680],
      [3.2830, 6.4700],
    ],
  },
  {
    id: "rider-4",
    name: "Oluwaseun Bakare",
    longitude: 3.5145,
    latitude: 6.5892,
    status: "charging",
    routeHistory: [
      [3.5412, 6.5215],
      [3.5145, 6.5892],
    ],
  },
  {
    id: "rider-5",
    name: "Fatimah Abdullahi",
    longitude: 3.2925,
    latitude: 6.5852,
    status: "en-route",
    routeHistory: [
      [3.2285, 6.6185],
      [3.2925, 6.5852],
    ],
  },
  {
    id: "rider-6",
    name: "Taiwo Adeniyi",
    longitude: 3.3650,
    latitude: 6.5510,
    status: "en-route",
    routeHistory: [
      [3.3580, 6.5420],
      [3.3650, 6.5510],
    ],
  },
  {
    id: "rider-7",
    name: "Blessing Okonkwo",
    longitude: 3.4120,
    latitude: 6.4580,
    status: "en-route",
    routeHistory: [
      [3.4050, 6.4510],
      [3.4120, 6.4580],
    ],
  },
  {
    id: "rider-8",
    name: "Musa Danjuma",
    longitude: 3.3480,
    latitude: 6.4850,
    status: "idle",
    routeHistory: [
      [3.3520, 6.4780],
      [3.3480, 6.4850],
    ],
  },
  {
    id: "rider-9",
    name: "Chidinma Obi",
    longitude: 3.3920,
    latitude: 6.6120,
    status: "en-route",
    routeHistory: [
      [3.3850, 6.6050],
      [3.3920, 6.6120],
    ],
  },
  {
    id: "rider-10",
    name: "Kehinde Balogun",
    longitude: 3.3280,
    latitude: 6.5320,
    status: "charging",
    routeHistory: [
      [3.3350, 6.5250],
      [3.3280, 6.5320],
    ],
  },
  {
    id: "rider-11",
    name: "Ngozi Emenike",
    longitude: 3.4350,
    latitude: 6.4710,
    status: "en-route",
    routeHistory: [
      [3.4280, 6.4650],
      [3.4350, 6.4710],
    ],
  },
  {
    id: "rider-12",
    name: "Yusuf Abubakar",
    longitude: 3.2680,
    latitude: 6.6050,
    status: "en-route",
    routeHistory: [
      [3.2750, 6.5980],
      [3.2680, 6.6050],
    ],
  },
  {
    id: "rider-13",
    name: "Aisha Mohammed",
    longitude: 3.3150,
    latitude: 6.4520,
    status: "idle",
    routeHistory: [
      [3.3200, 6.4460],
      [3.3150, 6.4520],
    ],
  },
  {
    id: "rider-14",
    name: "Emmanuel Okafor",
    longitude: 3.4780,
    latitude: 6.4480,
    status: "en-route",
    routeHistory: [
      [3.4700, 6.4420],
      [3.4780, 6.4480],
    ],
  },
  {
    id: "rider-15",
    name: "Funmilayo Ogundare",
    longitude: 3.3580,
    latitude: 6.5780,
    status: "en-route",
    routeHistory: [
      [3.3520, 6.5710],
      [3.3580, 6.5780],
    ],
  },
  {
    id: "rider-16",
    name: "Chukwuemeka Ani",
    longitude: 3.5020,
    latitude: 6.5540,
    status: "charging",
    routeHistory: [
      [3.4950, 6.5480],
      [3.5020, 6.5540],
    ],
  },
  {
    id: "rider-17",
    name: "Halima Usman",
    longitude: 3.2450,
    latitude: 6.6350,
    status: "en-route",
    routeHistory: [
      [3.2520, 6.6280],
      [3.2450, 6.6350],
    ],
  },
  {
    id: "rider-18",
    name: "Obinna Eze",
    longitude: 3.3850,
    latitude: 6.5020,
    status: "en-route",
    routeHistory: [
      [3.3780, 6.4960],
      [3.3850, 6.5020],
    ],
  },
  {
    id: "rider-19",
    name: "Tolulope Adesanya",
    longitude: 3.4250,
    latitude: 6.5180,
    status: "idle",
    routeHistory: [
      [3.4180, 6.5120],
      [3.4250, 6.5180],
    ],
  },

  // ── Inactive riders (5, 2 with technical issues) ────────────────────
  {
    id: "rider-20",
    name: "Segun Oladimeji",
    longitude: 3.3720,
    latitude: 6.5680,
    status: "inactive",
    routeHistory: [
      [3.3680, 6.5620],
      [3.3720, 6.5680],
    ],
  },
  {
    id: "rider-21",
    name: "Amina Bello",
    longitude: 3.3350,
    latitude: 6.4680,
    status: "inactive",
    routeHistory: [
      [3.3400, 6.4620],
      [3.3350, 6.4680],
    ],
  },
  {
    id: "rider-22",
    name: "Damilola Ogunbiyi",
    longitude: 3.4650,
    latitude: 6.4250,
    status: "inactive",
    routeHistory: [
      [3.4600, 6.4200],
      [3.4650, 6.4250],
    ],
  },
  {
    id: "rider-23",
    name: "Bisi Akande",
    longitude: 3.3050,
    latitude: 6.5150,
    status: "technical-issue",
    routeHistory: [
      [3.3100, 6.5090],
      [3.3050, 6.5150],
    ],
  },
  {
    id: "rider-24",
    name: "Ikechukwu Nnamdi",
    longitude: 3.4920,
    latitude: 6.5720,
    status: "technical-issue",
    routeHistory: [
      [3.4870, 6.5660],
      [3.4920, 6.5720],
    ],
  },
];
