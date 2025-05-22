import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CalendarDays, CheckCircle, ClipboardList, Users, Building2, FileText, ArrowRight, Star } from "lucide-react";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureCard } from "@/components/landing/feature-card";
import { TestimonialCard } from "@/components/landing/testimonial-card";
import { ProblemSolution } from "@/components/landing/problem-solution";
import { Footer } from "@/components/landing/footer";
import { MainNav } from "@/components/landing/main-nav";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center px-6">
          <MainNav />
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Log in
            </Link>
            <Button asChild>
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <HeroSection />
        
        <ProblemSolution />
        
        <section id="features" className="py-24 bg-muted/50">
          <div className="container px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Key Features</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                All the tools you need to plan and execute perfect events, in one place.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard 
                icon={<CalendarDays className="h-10 w-10 text-primary" />}
                title="Event Timeline"
                description="Create detailed timelines with milestones. Keep everyone on track with a visual schedule that makes planning intuitive."
              />
              <FeatureCard 
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Guest Management"
                description="Track RSVPs, meal preferences, and seating arrangements. Import your guest list and manage every detail."
              />
              <FeatureCard 
                icon={<Building2 className="h-10 w-10 text-primary" />}
                title="Vendor Coordination"
                description="Store all vendor contacts in one place. Assign vendors to events and tasks for seamless coordination."
              />
              <FeatureCard 
                icon={<ClipboardList className="h-10 w-10 text-primary" />}
                title="Task Management"
                description="Create to-do lists with deadlines and assign tasks to team members. Never miss a critical task again."
              />
              <FeatureCard 
                icon={<FileText className="h-10 w-10 text-primary" />}
                title="Notes & Documents"
                description="Upload contracts, photos, and inspiration. Keep all your important files organized by event."
              />
              <FeatureCard 
                icon={<CheckCircle className="h-10 w-10 text-primary" />}
                title="Client Portal"
                description="Give clients controlled access to their event details. Keep them informed without overwhelming them."
              />
            </div>
          </div>
        </section>
        
        <section id="use-case" className="py-24">
          <div className="container px-6">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold tracking-tight mb-4">How Lisa Saved 20 Hours Planning 3 Weddings</h2>
                <p className="text-muted-foreground text-lg">A real-world example of EventFlow in action</p>
              </div>
              
              <div className="bg-card rounded-lg shadow-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                  <div className="md:col-span-3">
                    <p className="mb-4">
                      "Before EventFlow, I was drowning in spreadsheets, missed emails, and confusion. Managing multiple weddings meant juggling hundreds of details and constantly updating documents."
                    </p>
                    <p className="mb-4">
                      "Now, I keep everything in one place. My assistants can see exactly what needs to be done, vendors know where to upload contracts, and clients feel connected to the process without being overwhelmed."
                    </p>
                    <p className="font-medium">
                      "I've literally saved 20+ hours per month, and my clients are happier than ever!"
                    </p>
                    <div className="mt-6 flex items-center">
                      <div className="mr-4 h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-primary font-bold">LP</span>
                      </div>
                      <div>
                        <h4 className="font-medium">Lisa Peterson</h4>
                        <p className="text-sm text-muted-foreground">Elegant Events & Weddings</p>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2 flex flex-col space-y-4">
                    <div className="bg-muted rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">30% less client questions</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Clients can see status without asking</p>
                    </div>
                    <div className="bg-muted rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">15 hours saved on vendor coordination</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Automated updates keep everyone in sync</p>
                    </div>
                    <div className="bg-muted rounded-md p-4">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-primary mr-2" />
                        <span className="font-medium">Zero missed deadlines</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Task reminders prevent critical oversights</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section id="testimonials" className="py-24 bg-muted/50">
          <div className="container px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">What Our Users Say</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join event professionals who are saving time and delivering better results.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <TestimonialCard 
                quote="EventFlow has completely transformed how I manage corporate events. Everything I need is just a click away."
                author="Mark Johnson"
                role="Corporate Event Manager"
                rating={5}
              />
              <TestimonialCard 
                quote="My team is more coordinated than ever. We can all see what needs to be done and who's responsible."
                author="Sarah Williams"
                role="Wedding Planner"
                rating={5}
              />
              <TestimonialCard 
                quote="The client portal feature alone has saved me countless hours of back-and-forth emails."
                author="David Chen"
                role="Event Director"
                rating={4}
              />
            </div>
          </div>
        </section>
        
        <section id="cta" className="py-24 bg-primary text-primary-foreground">
          <div className="container px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Transform Your Event Planning?</h2>
              <p className="text-xl opacity-90 mb-8">
                Join our beta program today and get unlimited access to all features for free.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/signup">
                    Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/demo">Request Demo</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm opacity-75">
                No credit card required. Future pricing will start at $29/month after beta.
              </p>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}