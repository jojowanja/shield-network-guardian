
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Signal, Wifi } from "lucide-react";

interface OptimizationSuggestionProps {
  title: string;
  description: string;
  type: "warning" | "info";
  actionLabel: string;
  onAction: () => void;
}

export const OptimizationSuggestion = ({
  title,
  description,
  type,
  actionLabel,
  onAction
}: OptimizationSuggestionProps) => {
  const { toast } = useToast();

  const handleAction = () => {
    onAction();
    toast({
      title: "Optimization applied",
      description: `${title} has been configured`,
    });
  };

  return (
    <div className="border rounded-lg p-4 flex justify-between items-center animate-fade-in hover:border-primary/50 transition-all duration-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className={`h-10 w-10 rounded-full transition-transform hover:scale-105 ${
          type === "warning" ? "bg-status-warning/20" : "bg-status-safe/20"
        } flex items-center justify-center ${
          type === "warning" ? "text-status-warning" : "text-status-safe"
        }`}>
          {type === "warning" ? 
            <Signal size={20} className="animate-pulse-soft" /> : 
            <Wifi size={20} className="animate-pulse-soft" />
          }
        </div>
        <div>
          <p className="font-medium transition-colors hover:text-primary">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <Button 
        variant={type === "warning" ? "default" : "outline"}
        className={`transition-all duration-300 hover:scale-105 ${
          type === "warning" ? "bg-shield hover:bg-shield-secondary" : ""
        }`}
        onClick={handleAction}
      >
        {actionLabel}
      </Button>
    </div>
  );
};
