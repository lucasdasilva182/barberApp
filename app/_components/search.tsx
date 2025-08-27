'use client';

import { Button } from '@/app/_components/ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/app/_components/ui/form';
import { Input } from '@/app/_components/ui/input';
import { SearchIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

interface SearchProps {
  defaultValues?: z.infer<typeof formSchema>;
  customClass?: String;
}

const formSchema = z.object({
  search: z
    .string({
      required_error: '',
    })
    .trim()
    .min(1, ''),
});

const Search = ({ defaultValues, customClass }: SearchProps) => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    router.push(`/barbershops?search=${data.search}`);
  };

  return (
    <div className={`flex items-center gap-2 min-w-80 ${customClass}`}>
      <Form {...form}>
        <form className="flex w-full gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <FormField
            control={form.control}
            name="search"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex w-full gap-2 relative">
                    <Input placeholder="Busque por uma barbearia" {...field} />
                    <Button
                      variant="ghost"
                      type="submit"
                      className="absolute right-0 top-1/2 -translate-y-1/2 hover:bg-transparent"
                    >
                      <SearchIcon size={20} />
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default Search;
