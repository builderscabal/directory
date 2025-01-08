import { Button } from "@/components/ui/button";
import {
  MessageCircleQuestion,
  Network,
  Users,
  Zap,
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface UserProps {
  userId: string;
}

const JoinCommunityScreen = ({ userId }: UserProps) => {
  const profile = useQuery(api.users.getUserByClerkId, {
    clerkId: userId,
  });

  const updateUser = useMutation(api.users.updateUser);

  const handleJoinCommunity = async () => {
    try {
      await updateUser({
        userId: profile?._id as Id<"users">,
        joinCommunity: true
      });
      window.open("/join", "_blank");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="py-8 sm:py-16">
      <div className="sm:container">
        <p className="mb-4 text-xs sm:text-sm text-muted-foreground">
          Why join the BuildersCabal Community?
        </p>
        <h2 className="text-3xl font-medium lg:text-5xl">
          A Better Way to Build Startups
        </h2>
        
        <Button className="justify-center mt-4" onClick={handleJoinCommunity}>Join the Community</Button>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <Zap className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Grow
                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                Gain access to invaluable resources and connections that
                minimize your time to market, empowering you to focus on
                building and scaling your product.
              </p>
            </div>
          </div>

          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <Users className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Collaborate
                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                Build alongside over 500 founders, operators, and investors
                within the African tech ecosystem, leveraging diverse insights
                that drive innovation and success.
              </p>
            </div>
          </div>

          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <Network className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Network
                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                Connect with a trusted community of tech leaders and innovators,
                fostering quality relationships that empower growth and create
                valuable partnerships.
              </p>
            </div>
          </div>

          <div className="relative flex gap-3 rounded-lg border-dashed md:block md:border-l md:p-5">
            <span className="mb-8 flex size-10 shrink-0 items-center justify-center rounded-full bg-accent md:size-12">
              <MessageCircleQuestion className="size-5 md:size-6" />
            </span>
            <div>
              <h3 className="font-medium md:mb-2 md:text-xl">
                Realtime Support
                <span className="absolute -left-px hidden h-6 w-px bg-primary md:inline-block"></span>
              </h3>
              <p className="text-sm text-muted-foreground md:text-base">
                Receive prompt assistance and expert guidance from our community, ensuring you have the resources you need at your fingertips to successfully navigate every stage of your startup journey
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinCommunityScreen;