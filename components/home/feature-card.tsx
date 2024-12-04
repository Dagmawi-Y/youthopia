import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

export function FeatureCard({ title, description, icon: Icon, color }: FeatureCardProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-200 border-none bg-white/60 backdrop-blur-sm">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Card>
  );
}