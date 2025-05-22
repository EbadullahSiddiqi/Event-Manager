import { CheckCircle, XCircle } from "lucide-react";

export function ProblemSolution() {
  return (
    <section className="py-24">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">The Problem with Event Planning Today</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Most event planners struggle with scattered information and inefficient processes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <XCircle className="h-6 w-6 text-destructive mr-2" />
              Without EventFlow
            </h3>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-destructive font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Information Scattered Everywhere</h4>
                  <p className="text-muted-foreground">
                    Spreadsheets, emails, text messages, and paper notes make it hard to find what you need.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-destructive font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Communication Breakdowns</h4>
                  <p className="text-muted-foreground">
                    Vendors miss emails, clients ask the same questions repeatedly, and team members aren't updated.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-destructive font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Missed Deadlines & Details</h4>
                  <p className="text-muted-foreground">
                    Critical tasks fall through the cracks when managing multiple events simultaneously.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-destructive font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Time-Consuming Manual Updates</h4>
                  <p className="text-muted-foreground">
                    Hours spent manually updating documents and communicating changes to stakeholders.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-6 flex items-center">
              <CheckCircle className="h-6 w-6 text-primary mr-2" />
              With EventFlow
            </h3>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-primary font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Centralized Information Hub</h4>
                  <p className="text-muted-foreground">
                    All event details, contacts, and documents in one accessible location.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-primary font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Streamlined Communication</h4>
                  <p className="text-muted-foreground">
                    Client portal and vendor coordination tools keep everyone informed automatically.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-primary font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Task Tracking & Reminders</h4>
                  <p className="text-muted-foreground">
                    Automated reminders and clear task assignments ensure nothing is forgotten.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-primary font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Time-Saving Automation</h4>
                  <p className="text-muted-foreground">
                    Updates reflect instantly for all stakeholders, reducing manual work by 70%.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}