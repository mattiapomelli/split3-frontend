import Image from "next/image";

export const TechnologiesSecion = () => {
  return (
    <section className="flex flex-col items-center gap-10 py-32">
      <h3 className="max-w-[30rem] text-center text-3xl font-bold">
        Powered by
      </h3>
      <div className="flex flex-col items-center gap-x-8 gap-y-10">
        <Image
          src="/request-logo.svg"
          height={42}
          width={238}
          alt="Request"
          className="mt-8"
        />
        <Image
          src="/safe.png"
          width={7458 / 26}
          height={2757 / 26}
          alt="Lens"
          className="mt-8"
        />
        <Image
          src="/mantle.png"
          height={42}
          width={238}
          alt="Request"
          className="mt-8"
        />
        <Image src="/celo.png" height={42} width={238} alt="Request" />
      </div>
    </section>
  );
};
