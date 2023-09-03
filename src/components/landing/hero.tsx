import Link from "next/link";

import { Button } from "@components/basic/button";

export const Hero = () => {
  return (
    <section className="relative flex flex-col items-center gap-6 py-36 text-center">
      <h1 className="max-w-[42rem] text-4xl font-bold md:text-5xl">
        Share expenses in groups with <span className="text-primary">ease</span>
      </h1>
      <p className="max-w-[20rem] text-xl text-base-content-neutral sm:max-w-[36rem]">
        Split3 allows you to manage and share expenses with your friends,
        family, roomates, whoever. Everything with crypto. Based on Safe
        MultiSig wallet for maximum security.
        {/* Online education is the future, but lacks the social aspect and
        interaction that in-person education provides. Lenschool bring social
        elements to online education. */}
      </p>
      <div className="flex gap-2">
        <Link href="/groups">
          <Button size="lg" variant="outline">
            See your groups
          </Button>
        </Link>
        <Link href="/new">
          <Button size="lg">Create a group</Button>
        </Link>
      </div>
    </section>
  );
};
