import { Challenge } from "@/lib/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Clock } from "lucide-react";

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <img
          src={challenge.imageUrl}
          alt={challenge.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-4 left-4 text-white font-bold text-xl">
          {challenge.title}
        </h3>
      </div>
      <CardContent className="pt-4">
        <p className="text-gray-600 mb-4">{challenge.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{challenge.participants} participants</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{challenge.daysLeft} days left</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full bg-[#7BD3EA] hover:bg-[#A1EEBD] text-black">
          Join Challenge
        </Button>
      </CardFooter>
    </Card>
  );
}