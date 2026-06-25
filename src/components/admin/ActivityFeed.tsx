// src/components/admin/ActivityFeed.tsx
import { Clock, Package, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Activity {
  id: string;
  type: "product" | "workshop";
  title: string;
  createdAt: Date;
  action: "created" | "updated" | "deleted";
}

export default function ActivityFeed({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return <p className="text-earth-400 text-sm">Aucune activité récente</p>;
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => {
        const Icon = activity.type === "product" ? Package : Calendar;
        const color =
          activity.type === "product" ? "text-peach bg-peach-light/30" : "text-mint bg-mint-light/30";

        return (
          <div
            key={activity.id}
            className="flex items-start gap-3 p-3 rounded-xl hover:bg-cream-50 transition-colors"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${color}`}>
              <Icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-earth-800">
                <span className="font-medium">{activity.title}</span>
                <span className="text-earth-500">
                  {" "}
                  {activity.action === "created"
                    ? "ajouté"
                    : activity.action === "updated"
                    ? "modifié"
                    : "supprimé"}
                </span>
              </p>
              <p className="text-xs text-earth-400 flex items-center gap-1 mt-0.5">
                <Clock size={12} />
                {formatDate(activity.createdAt)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}