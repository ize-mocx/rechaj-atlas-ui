import {
  IconMotorbike,
  IconRefresh,
  IconArrowsExchange,
  IconBolt,
  IconBuildingWarehouse,
  IconBuildingFactory2,
} from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const summaryCards = [
  {
    title: "Active Riders",
    icon: IconMotorbike,
    value: "24",
    detail: "19 online now",
  },
  {
    title: "Retrofit Stations",
    icon: IconRefresh,
    value: "5",
    detail: "1 at capacity",
  },
  {
    title: "Swap Stations",
    icon: IconArrowsExchange,
    value: "8",
    detail: "84 swaps today",
  },
  {
    title: "Charge Stations",
    icon: IconBolt,
    value: "10",
    detail: "27 batteries charging",
  },
  {
    title: "Depots",
    icon: IconBuildingWarehouse,
    value: "8",
    detail: "12 vehicles stored",
  },
  {
    title: "Production Facilities",
    icon: IconBuildingFactory2,
    value: "3",
    detail: "56 units/day output",
  },
];

function Footer() {
  return (
    <div className="border-t border-border bg-background p-2">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {summaryCards.map((card) => (
          <Card key={card.title} size="sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <card.icon className="size-4 text-muted-foreground" />
                <CardTitle className="text-xs">{card.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <span className="text-2xl font-bold">{card.value}</span>
              <Badge className="mt-1 w-fit">{card.detail}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export { Footer };
