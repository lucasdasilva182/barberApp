import { redirect } from 'next/navigation';
import BarbershopItem from '../(home)/_components/barbershop-item';
import Header from '../_components/header';
import { db } from '../_lib/prisma';
import Search from '../(home)/_components/search';

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
      <Header />

      <div className="container px-5 py-6 pt-24 flex flex-col gap-6">
        <h1 className="text-gray-400 font-bold text-xs uppercase">
          Resultados para &quot;{searchParams.search}&quot;
        </h1>

        <div className="flex gap-4">
          {barbershops.map((barbershop) => (
            <div className="min-w-[167px] max-w-[167px]" key={barbershop.id}>
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
