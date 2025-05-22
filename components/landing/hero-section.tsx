"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarCheck, Users, Building2, ClipboardList } from "lucide-react";

export function HeroSection() {
  const [activeFeature, setActiveFeature] = useState(0);
  const features = [
    { 
      icon: <CalendarCheck className="h-6 w-6" />, 
      label: "Event Timeline" 
    },
    { 
      icon: <Users className="h-6 w-6" />, 
      label: "Guest Management" 
    },
    { 
      icon: <Building2 className="h-6 w-6" />, 
      label: "Vendor Coordination" 
    },
    { 
      icon: <ClipboardList className="h-6 w-6" />, 
      label: "Task Management" 
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="relative pt-20 pb-16 md:pt-24 md:pb-20 lg:pt-32 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      
      <div className="container relative px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Simplify Your Next Event with Smart Planning
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              All-in-one dashboard for event planners & wedding coordinators. Manage guests, vendors, schedules, and communications in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Try for Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">See a Demo</Link>
              </Button>
            </div>
            
            <div className="mt-12 flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground">
                Featuring:
              </span>
              <div className="flex gap-6">
                {features.map((feature, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-1.5 transition-all duration-300 ${
                      activeFeature === idx 
                        ? "text-primary scale-110" 
                        : "text-muted-foreground scale-100"
                    }`}
                  >
                    {feature.icon}
                    <span className="text-sm font-medium">{feature.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-[4/3] rounded-xl overflow-hidden border shadow-xl bg-background">
              <div className="absolute inset-0 flex items-center justify-center">
                <img 
                  src="https://images.pexels.com/photos/1181406/pexels-photo-1181406.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                  alt="EventFlow Dashboard" 
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-background/60 backdrop-blur-sm" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-4/5 h-4/5 bg-background rounded-lg shadow-lg p-4 flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-3 w-3 rounded-full bg-destructive"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="h-4 w-20 bg-muted rounded"></div>
                        <div className="h-4 w-4 bg-muted rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1 flex">
                      <div className="w-1/4 border-r pr-2">
                        <div className="h-6 w-full bg-primary/20 rounded mb-2"></div>
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="h-4 w-full bg-muted rounded mb-2"></div>
                        ))}
                      </div>
                      <div className="flex-1 pl-2">
                        <div className="h-8 w-1/2 bg-primary/20 rounded mb-4"></div>
                        <div className="grid grid-cols-2 gap-2">
                          {[...Array(4)].map((_, i) => (
                            <div key={i} className="h-16 bg-muted rounded p-2">
                              <div className="h-3 w-3/4 bg-primary/20 rounded mb-1"></div>
                              <div className="h-2 w-1/2 bg-muted-foreground/20 rounded"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 h-24 w-48 bg-primary/10 rounded-lg blur-2xl"></div>
            <div className="absolute -top-6 -left-6 h-24 w-48 bg-primary/10 rounded-lg blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}