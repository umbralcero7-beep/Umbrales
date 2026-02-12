'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const nameSchema = z.object({
  name: z.string().min(2, { message: 'Tu nombre debe tener al menos 2 caracteres.' }),
});

export function NameForm() {
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => user ? doc(firestore, 'users', user.uid) : null, [user, firestore]);
  const { data: userProfile } = useDoc<{username: string}>(userDocRef);
  
  const form = useForm<z.infer<typeof nameSchema>>({
    resolver: zodResolver(nameSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (userProfile?.username) {
        form.setValue('name', userProfile.username);
    }
  }, [form, userProfile]);

  async function onSubmit(values: z.infer<typeof nameSchema>) {
    if (user) {
      const userRef = doc(firestore, "users", user.uid);
      try {
        await updateDoc(userRef, { username: values.name });
        toast({
          title: 'Nombre Actualizado',
          description: 'Tu nombre ha sido cambiado exitosamente.',
        });
      } catch (error) {
        console.error("Failed to update name:", error);
        toast({
          variant: "destructive",
          title: 'Error',
          description: 'No se pudo actualizar tu nombre. Inténtalo de nuevo.',
        });
      }
    }
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
        <Button type="submit" disabled={!user}>Guardar Nombre</Button>
      </form>
    </Form>
  );
}
