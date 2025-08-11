// Modified: Pull authenticated user's name for the welcome section
import { DashboardLayout } from "@/components/DashboardLayout";
import { WelcomeSection } from "@/components/WelcomeSection";
import { RoadmapSection } from "@/components/RoadmapSection";
import { ChatbotPanel } from "@/components/ChatbotPanel";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const userName = user?.name || "Guest";

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
