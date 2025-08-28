import { redirect } from 'next/navigation';
import BarbershopItem from '../(home)/_components/barbershop-item';
import { db } from '../_lib/prisma';

interface BarbershopsPageProps {
  searchParams: {
    search?: string;
  };
}

const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  if (!searchParams.search) {
    redirect('/');
  }

  const barbershops = await db.barbershop.findMany({
    where: {
      name: {
        contains: searchParams.search,
        mode: 'insensitive',
      },
    },
  });

  return (
    <>
      <div className="container px-5 py-6 pt-24 flex flex-col gap-6">
        <h1 className="text-gray-400 font-bold text-xs uppercase">
          Resultados para &quot;{searchParams.search}&quot;
        </h1>

        <div className="flex flex-wrap gap-4">
          {barbershops.map((barbershop) => (
            <div className="basis-1/2 md:basis-1/4 lg:basis-1/6" key={barbershop.id}>
              <BarbershopItem barbershop={barbershop} />
            </div>
          ))}
        </div>

        {barbershops.length == 0 && <p className="text-center">Nenhum resultado encontrado.</p>}
      </div>
    </>
  );
};

export default BarbershopsPage;
