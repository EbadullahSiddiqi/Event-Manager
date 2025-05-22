import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative bg-card hover:bg-card/80 rounded-lg p-6 shadow-sm hover:shadow-md transition-all border overflow-hidden">
      <div className="absolute top-0 right-0 h-24 w-24 bg-primary/5 rounded-bl-[100px] transform translate-x-8 -translate-y-8 group-hover:translate-x-6 group-hover:-translate-y-6 transition-transform"></div>
      
      <div className="relative mb-4">{icon}</div>
      
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}