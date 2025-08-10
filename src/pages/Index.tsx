// Modified: Pull authenticated user's name for the welcome section
import * as React from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { WelcomeSection } from "@/components/WelcomeSection";
import { RoadmapSection } from "@/components/RoadmapSection";
import { ChatbotPanel } from "@/components/ChatbotPanel";
import { authMe, getToken } from "@/lib/api";

const Index = () => {
  const [userName, setUserName] = React.useState<string>("Ahmed");

  React.useEffect(() => {
    const token = getToken();
    if (!token) return;
    (async () => {
      try {
        const me = await authMe();
        if (me?.name) setUserName(me.name);
      } catch {
        // ignore if unauthenticated
      }
    })();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-8">
            <WelcomeSection userName={userName} progress={65} />
            <RoadmapSection />
          </div>
          
          {/* Chatbot Panel */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <ChatbotPanel />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
