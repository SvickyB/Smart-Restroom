import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const SensorCard = ({ title, value, type, threshold }) => {
  const getProgressColor = () => {
    if (type === 'depleting') {
      return value < threshold ? 'bg-red-500' : 'bg-green-500';
    }
    return value > threshold ? 'bg-red-500' : 'bg-green-500';
  };

  const getStatusText = () => {
    if (type === 'depleting') {
      return value < threshold ? 'Low' : 'Normal';
    }
    return value > threshold ? 'Full' : 'Normal';
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="text-sm font-medium text-muted-foreground">
          {getStatusText()}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress
            value={value}
            className={`h-2 ${getProgressColor()}`}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>{value}%</div>
            <div>Threshold: {threshold}%</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensorCard;
