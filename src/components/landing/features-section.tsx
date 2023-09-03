import {
  AcademicCapIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { ReactNode } from "react";

interface ComponentCardProps {
  title: string;
  description: string;
  icon: ReactNode;
}

const FeatureCard = ({ title, description, icon }: ComponentCardProps) => {
  return (
    <div className="rounded-box flex max-w-[20rem] flex-col gap-4 bg-base-300 p-6">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
        <span className="h-8 w-8 text-primary-content">{icon}</span>
      </div>
      <h4 className="text-xl font-bold">{title}</h4>
      <p className="text-base-content-neutral">{description}</p>
    </div>
  );
};

export const FeaturesSection = () => {
  return (
    <section className="flex flex-col items-center gap-10 py-32">
      <h3 className="max-w-[30rem] text-center text-3xl font-bold">
        Everything you need to manage your{" "}
        <span className="text-primary">group expenses</span>
      </h3>
      {/* <p className="max-w-[30rem] text-center text-lg text-base-content-neutral">
        Split3 allows you to manage and share expenses with your friends
      </p> */}
      <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2">
        <FeatureCard
          icon={<AcademicCapIcon />}
          title="Add Expenses"
          description="Members can add expenses, which need to be approved by the group"
        />
        <FeatureCard
          icon={<UserGroupIcon />}
          title="Track Debt"
          description="Easily see how much you owe and how much you are owed by other members."
        />
        <FeatureCard
          icon={<ChatBubbleLeftRightIcon />}
          title="Pay with Ease"
          description="Pay your debt and request payments from other members, everything with crypto"
        />
        <FeatureCard
          icon={<CurrencyDollarIcon />}
          title="Common Fund"
          description="Members can put money in a common fund, which can be used to pay for expenses."
        />
      </div>
    </section>
  );
};
