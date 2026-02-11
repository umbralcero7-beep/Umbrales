'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const nameSchema = z.object({
  name: z.string().min(2, { message: 'Tu nombre debe tener al menos 2 caracteres.' }),
});

export function NameForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      form.setValue('name', storedName);
    }
  }, [form]);

  function onSubmit(values: z.infer<typeof nameSchema>) {
    localStorage.setItem('userName', values.name);
    // Dispatch a custom event to notify other components like UserNav
    window.dispatchEvent(new Event('storage'));
    toast({
      title: 'Nombre Actualizado',
      description: 'Tu nombre ha sido cambiado exitosamente.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-sm">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tu Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Guardar Nombre</Button>
      </form>
    </Form>
  );
}
